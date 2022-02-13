// import dbConnect from '@utils/dbConnect'

// import csv from '../tilda.csv'

// const csvToJsonFunc = () => {
//   csv()
// // .fromFile(csvFilePath)
// .fromStream(request.get('https://store.tilda.cc/store/export/?task=922544378201'))
// .then((jsonObj)=>{
//     console.log(jsonObj);
//     /**
//      * [
//      * 	{a:"1", b:"2", c:"3"},
//      * 	{a:"4", b:"5". c:"6"}
//      * ]
//      */
// })
//   // const json = csvToJson.formatValueByType().getJsonFromCsv('tilda.csv')
//   // console.log(`json`, js`on)
// }

export default function Home() {
  // const { height, width } = useWindowDimensions()
  // const { data: session, status } = useSession()
  // const loading = status === 'loading'

  // if (session) console.log(`session`, session)

  return <div>Главная страница</div>
}

/* Retrieves pet(s) data from mongodb database */
// export async function getServerSideProps() {
//   await dbConnect()

//   const productTypes = prepareFetchProps(await ProductTypes.find({}).lean())
//   const setTypes = prepareFetchProps(await SetTypes.find({}).lean())
//   const sets = prepareFetchProps(await Sets.find({}).lean())
//   const products = prepareFetchProps(await Products.find({}).lean())
//   const districts = prepareFetchProps(await Districts.find({}).lean())

//   return {
//     props: {
//       products,
//       productTypes,
//       sets,
//       setTypes,
//       districts,
//     },
//   }
// }

// export async function getServerSideProps(ctx) {
//   return {
//     props: {
//       session: await getSession(ctx),
//     },
//   }
// }
