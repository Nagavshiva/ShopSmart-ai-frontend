import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-20 border-t">

      {/* Title */}
      <div className="text-xl sm:text-2xl text-center pt-8">
        <Title text1="ABOUT" text2="US" />
      </div>

      {/* About Content */}
      <div className="my-10 flex flex-col lg:flex-row gap-10 lg:gap-16 max-w-7xl mx-auto">
        <img
          className="w-full lg:w-1/2 lg:max-w-[450px] rounded"
          src={assets.about_img}
          alt="About"
        />

        <div className="flex flex-col justify-center gap-4 text-gray-600 text-sm sm:text-base lg:w-1/2">
          <p>
            Shopsmart AI was born out of a passion for innovation and a desire to revolutionize the way people shop online. Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, and purchase a wide range of products from the comfort of their homes.
          </p>
          <p>
            Since our inception, we've worked tirelessly to curate a diverse selection of high-quality products that cater to every taste and preference. From fashion and beauty to electronics and home essentials, we offer an extensive collection sourced from trusted brands and suppliers.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            Our mission at Shopsmart AI is to empower customers with choice, convenience, and confidence. We're dedicated to providing a seamless shopping experience that exceeds expectations, from browsing and ordering to delivery and beyond.
          </p>
        </div>
      </div>

      {/* Why Choose Us Title */}
      <div className="text-lg sm:text-xl text-center py-4">
        <Title text1="WHY" text2="CHOOSE US" />
      </div>

      {/* Info Cards (stack on md and below) */}
      <div className="flex flex-col lg:flex-row gap-6 mb-20 max-w-7xl mx-auto text-sm sm:text-base">
        <div className="border px-6 sm:px-10 py-8 sm:py-12 flex flex-col gap-4 rounded-md shadow-sm w-full">
          <b className="text-gray-800">Quality Assurance</b>
          <p className="text-gray-600">
            We meticulously select and vet each product to ensure it meets our stringent quality standards.
          </p>
        </div>

        <div className="border px-6 sm:px-10 py-8 sm:py-12 flex flex-col gap-4 rounded-md shadow-sm w-full">
          <b className="text-gray-800">Convenience</b>
          <p className="text-gray-600">
            With our user-friendly interface and hassle-free ordering process, shopping has never been easier.
          </p>
        </div>

        <div className="border px-6 sm:px-10 py-8 sm:py-12 flex flex-col gap-4 rounded-md shadow-sm w-full">
          <b className="text-gray-800">Exceptional Customer Service</b>
          <p className="text-gray-600">
            Our team of dedicated professionals is here to assist you every step of the way, ensuring your satisfaction is our top priority.
          </p>
        </div>
      </div>

      {/* Newsletter */}
      <NewsletterBox />
    </div>
  )
}

export default About
