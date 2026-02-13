export default defineAppConfig({
   ui: {
      colors: {
         secondary: "amber",
         neutral: "zinc",
      },
      header: {
         slots: {
            container: "max-w-auto",
         },
      },
      main: {
         base: "p-4 sm:px-6 lg:px-8",
      },
      modal: {
         variants: {
            fullscreen: {
               false: {
                  content: "max-w-lg",
               },
            },
         },
      },
      input: {
         slots: {
            root: "w-full",
         },
      },
      select: {
         slots: {
            base: "w-full",
         },
      },
      selectMenu: {
         slots: {
            base: "w-full",
         },
      },
      textarea: {
         slots: {
            root: "w-full",
         },
      },
      inputNumber: {
         slots: {
            root: "w-full",
         },
      },
      button: {
         variants: {
            color: {
               white: "",
            },
         },
         compoundVariants: [
            {
               color: "white",
               class: "text-default dark:text-inverted bg-default dark:bg-primary hover:bg-default/75 dark:hover:bg-inverted/75 active:bg-default/75 dark:active:bg-inverted/75 disabled:bg-inverted disabled:hover:bg-inverted aria-disabled:bg-inverted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default dark:focus-visible:outline-inverted",
            },
         ],
      },
   },
})
