export default function (value: string) {
   if (!value) return ""
   // Only allow numeric and '+' characters
   const cleaned = value.replace(/[^0-9+]/g, "")
   // Add space every 4 characters
   return cleaned.replace(/(.{3})/g, "$1 ").trim()
}
