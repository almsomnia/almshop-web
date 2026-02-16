export default function (gender: boolean, as: "icon" | "text" = "text") {
   if (gender) {
      return as === "icon" ? "lucide:mars" : "Male"
   } else {
      return as === "icon" ? "lucide:venus" : "Female"
   }
}
