import { consola } from "consola"
import { join, resolve, dirname } from "pathe"
import { promises as fs } from "node:fs"
import { fileURLToPath } from "node:url"
import Handlebars from "handlebars"

async function main() {
   const type = await consola.prompt("Select layer type:", {
      type: "select",
      options: ["base", "core", "domain"],
   })

   const name = await consola.prompt("Enter layer name:", {
      type: "text",
      placeholder: "Layer name",
   })

   if (!name || typeof name !== "string") {
      consola.error("Invalid name provided")
      process.exit(1)
   }

   // Calculate root directory
   const currentDir = dirname(fileURLToPath(import.meta.url))
   const rootDir = resolve(currentDir, "../../..")
   const templatesDir = resolve(currentDir, "../templates")

   const targetBaseMap: Record<string, string> = {
      base: "layers/base",
      core: "layers/core",
      domain: "layers/domains",
   }
   const targetBase = targetBaseMap[type as string]
   const targetDir = join(rootDir, targetBase, name)

   consola.info(`Creating ${type} layer '${name}' at ${targetDir}...`)

   try {
      await fs.access(targetDir)
      const overwrite = await consola.prompt(
         `Directory ${targetDir} already exists. Overwrite?`,
         {
            type: "confirm",
         }
      )
      if (!overwrite) {
         consola.info("Aborted.")
         process.exit(0)
      }
   } catch {}

   await fs.mkdir(targetDir, { recursive: true })

   // Data for templates
   const pkgName = {
      base: `@base/${name}`,
      core: `@core/${name}`,
      domain: `@domain/${name}`,
   }[type as string]

   let extendsPath = ""
   if (type === "core") {
      const baseDir = join(rootDir, "layers/base")
      try {
         const entries = await fs.readdir(baseDir, { withFileTypes: true })
         extendsPath = entries
            .filter((e) => e.isDirectory())
            .map((e) => `../../base/${e.name}`)
            .map((p) => `"${p}"`)
            .join(", ")
      } catch (e) {
         // Ignore if base dir doesn't exist
      }
   } else if (type === "domain") {
      const coreDir = join(rootDir, "layers/core")
      try {
         const entries = await fs.readdir(coreDir, { withFileTypes: true })
         extendsPath = entries
            .filter((e) => e.isDirectory())
            .map((e) => `../../core/${e.name}`)
            .map((p) => `"${p}"`)
            .join(", ")
      } catch (e) {
         consola.warn("Could not read layers/core directory")
      }
   }

   const templateData = {
      pkgName,
      extendsPath,
   }

   // Helper to read and compile template
   async function renderTemplate(templateName: string, data: any) {
      const templatePath = join(templatesDir, `${templateName}.hbs`)
      const templateContent = await fs.readFile(templatePath, "utf-8")
      const template = Handlebars.compile(templateContent)
      return template(data)
   }

   // Generate files
   const files = [
      { name: "package.json", template: "package.json" },
      { name: "tsconfig.json", template: "tsconfig.json" },
      { name: "nuxt.config.ts", template: "nuxt.config.ts" },
   ]

   for (const file of files) {
      const content = await renderTemplate(file.template, templateData)
      await fs.writeFile(join(targetDir, file.name), content)
   }

   consola.success(`Layer ${pkgName} created successfully at ${targetDir}`)

   // Extend layer in config
   async function updateNuxtConfig(filePath: string, layerPath: string) {
      try {
         await fs.access(filePath)
      } catch {
         return // File doesn't exist
      }

      try {
         let content = await fs.readFile(filePath, "utf-8")
         // Check if layerPath is already present to avoid duplicates
         if (
            content.includes(`"${layerPath}"`)
            || content.includes(`'${layerPath}'`)
         ) {
            return
         }

         const extendsRegex = /(extends:\s*\[)([\s\S]*?)(\])/

         let newContent = content
         if (extendsRegex.test(content)) {
            newContent = content.replace(
               extendsRegex,
               (match, start, inner, end) => {
                  const items = inner.trim()
                  const separator =
                     items.length && !items.endsWith(",") ? ", " : ""
                  return `${start}${inner}${separator}"${layerPath}"${end}`
               }
            )
         } else {
            // Insert extends if missing
            newContent = content.replace(
               /(defineNuxtConfig\(\s*\{)/,
               `$1  extends: ["${layerPath}"],`
            )
         }

         await fs.writeFile(filePath, newContent, "utf-8")
         consola.success(`Extended ${layerPath} in ${filePath}`)
      } catch (e) {
         consola.error(`Failed to update ${filePath}:`, e)
      }
   }

   if (type === "domain") {
      // Extend in app
      await updateNuxtConfig(
         join(rootDir, "app/nuxt.config.ts"),
         `../layers/domains/${name}`
      )
   } else if (type === "core") {
      // Extend in all domains
      const domainsDir = join(rootDir, "layers/domains")
      try {
         const domains = await fs.readdir(domainsDir, { withFileTypes: true })
         for (const dirent of domains) {
            if (dirent.isDirectory()) {
               await updateNuxtConfig(
                  join(domainsDir, dirent.name, "nuxt.config.ts"),
                  `../../core/${name}`
               )
            }
         }
      } catch (e) {
         // Ignore if domains dir doesn't exist
      }
   } else if (type === "base") {
      // Extend in all core layers
      const coreDir = join(rootDir, "layers/core")
      try {
         const cores = await fs.readdir(coreDir, { withFileTypes: true })
         for (const dirent of cores) {
            if (dirent.isDirectory()) {
               await updateNuxtConfig(
                  join(coreDir, dirent.name, "nuxt.config.ts"),
                  `../../base/${name}`
               )
            }
         }
      } catch (e) {
         // Ignore if core dir doesn't exist
      }
   }

   // Run pnpm install
   consola.info("Running 'pnpm install' to link dependencies...")
   const { execSync } = await import("node:child_process")
   try {
      execSync("pnpm install", { stdio: "inherit", cwd: rootDir })
      consola.success("Dependencies installed successfully.")
      const formatCode = await consola.prompt("Format code?", {
         type: "confirm",
      })
      if (formatCode) {
         execSync("pnpm format", { stdio: "inherit", cwd: rootDir })
         consola.success("Code formatted successfully.")
      }
   } catch (error) {
      consola.error("Failed to run 'pnpm install'. Please run it manually.")
   }
}

main().catch((err) => {
   consola.error(err)
   process.exit(1)
})
