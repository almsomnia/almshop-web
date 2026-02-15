export default function () {
   const wishlist = useLocalStorage<number[]>("almshop-wishlist", () => [])

   function toggleWishlist(item: number) {
      if (wishlist.value.includes(item)) {
         wishlist.value = wishlist.value.filter((id) => id !== item)
         return "removed"
      } else {
         wishlist.value.push(item)
         return "added"
      }
   }

   return {
      wishlist,
      toggleWishlist,
   }
}
