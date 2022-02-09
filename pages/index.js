import Block from '@components/Block'
import MainLayout from '@components/MainLayout'
import Link from 'next/link'
// const background = require('../public/img/bg.jpg')
import Title from '@components/Title'
import HorizontalSeparator from '@components/HorizontalSeparator'
import Card from '@components/Card'
import BlockOfCards from '@components/BlockOfCards'
import { motion } from 'framer-motion'
import useWindowDimensions from '@helpers/useWindowDimensions'
import Button from '@components/Button'
import SpecialCard from '@components/SpecialCard'
import InfoItem from '@components/InfoItem'
import DeliveryPriceItem from '@components/DeliveryPriceItem'

import TitleBlock2 from '@general/TitleBlock2'
import SpecialBlock from '@general/SpecialBlock'
import WhyWeBlock from '@general/WhyWeBlock'
import DeliveryBlock from '@general/DeliveryBlock'
// let csvToJson = require('convert-csv-to-json')
// const csvFilePath='tilda.csv'
// const csv=require('csvtojson')
// const request=require('request')

import { catalogData, setsData } from '@utils/temp_db'

import dbConnect from '@utils/dbConnect'
import Products from '@models/Products'
import ProductTypes from '@models/ProductTypes'
import SetTypes from '@models/SetTypes'
import Sets from '@models/Sets'
import Districts from '@models/Districts'

import { signIn, signOut, useSession, getSession } from 'next-auth/react'
import prepareFetchProps from '@helpers/prepareFetchProps'

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

export default function Home({
  products,
  sets,
  productTypes,
  setTypes,
  districts,
}) {
  // const { height, width } = useWindowDimensions()
  // const { data: session, status } = useSession()
  // const loading = status === 'loading'

  // if (session) console.log(`session`, session)

  return (
    <MainLayout title="Обними шарик - Главная">
      <div
        className="flex flex-col bg-white"
        style={{
          backgroundImage: `url('img/bg.jpg')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top',
          // backgroundSize: 'cover',
          width: '100%',
          height: '1120px',
        }}
      >
        <div className="w-full h-20" />
        {/* <div className="absolute bottom-0 w-full bg-white h-80" /> */}
        <div className="z-10 w-full mt-40">
          <TitleBlock2 />
          {/* <SpecialBlock /> */}
          <div className="bg-white">
            <Block>
              <BlockOfCards
                title="Каталог шаров"
                data={catalogData}
                columnsCount={4}
              />
              <BlockOfCards
                title="Готовые наборы"
                data={setsData}
                columnsCount={3}
              />
            </Block>
          </div>
          <WhyWeBlock />
          <DeliveryBlock districts={districts} />
        </div>
      </div>
    </MainLayout>
  )
}

/* Retrieves pet(s) data from mongodb database */
export async function getServerSideProps() {
  await dbConnect()

  const productTypes = prepareFetchProps(await ProductTypes.find({}).lean())
  const setTypes = prepareFetchProps(await SetTypes.find({}).lean())
  const sets = prepareFetchProps(await Sets.find({}).lean())
  const products = prepareFetchProps(await Products.find({}).lean())
  const districts = prepareFetchProps(await Districts.find({}).lean())

  return {
    props: {
      products,
      productTypes,
      sets,
      setTypes,
      districts,
    },
  }
}

// export async function getServerSideProps(ctx) {
//   return {
//     props: {
//       session: await getSession(ctx),
//     },
//   }
// }
