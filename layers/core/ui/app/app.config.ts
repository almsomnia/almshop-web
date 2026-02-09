export default defineAppConfig({
   ui: {
      colors: {
         secondary: "amber",
         neutral: "zinc"
      },
      header: {
         slots: {
            container: "max-w-auto"
         }
      },
      main: {
         base: "p-4 sm:px-6 lg:px-8"
      },
      modal: {
         variants: {
            fullscreen: {
               false: {
                  content: "max-w-lg"
               }
            }
         }
      },
      input: {
         slots: {
            root: "w-full"
         }
      },
   }
})
