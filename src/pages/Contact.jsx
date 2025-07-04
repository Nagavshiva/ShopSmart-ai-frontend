import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 border-t">
      {/* Title Section */}
      <div className="text-center text-xl sm:text-2xl pt-10 ">
        <Title text1="CONTACT" text2="US" />
      </div>

      {/* Content Section */}
      <div className="my-10 flex flex-col md:flex-row md:items-start lg:items-center gap-8 md:gap-10 lg:gap-16 max-w-7xl mx-auto mb-24">
        
        {/* Left Image */}
        <img
          className="w-full md:w-1/2 lg:max-w-[480px] rounded-md object-cover"
          src={assets.contact_img}
          alt="Contact"
        />

        {/* Right Text Content */}
        <div className="flex flex-col justify-center gap-4 text-sm sm:text-base text-gray-700 w-full md:w-1/2">
          <div>
            <p className="font-semibold text-lg sm:text-xl text-gray-800">Our Store</p>
            <p className="mt-1 text-gray-600">
              54709 Willms Station <br /> Suite 350, Washington, USA
            </p>
          </div>

          <div>
            <p className="text-gray-600">
              Tel: (415) 555-0132 <br /> Email: admin@ShopsmartAI.com
            </p>
          </div>

          <div className="mt-4">
            <p className="font-semibold text-lg sm:text-xl text-gray-800">Careers at Shopsmart AI</p>
            <p className="mt-1 text-gray-600">
              Learn more about our teams and job openings.
            </p>
          </div>

          <button className="mt-2 border border-black px-6 py-2 sm:px-8 sm:py-3 text-sm font-medium hover:bg-black hover:text-white transition duration-300 rounded">
            Explore Jobs
          </button>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterBox />
    </div>
  )
}

export default Contact
