export default function (
   date: string | Date | number,
   format: string = "DD MMM YYYY"
) {
   const dayjs = useDayjs()
   return dayjs(date).format(format)
}
