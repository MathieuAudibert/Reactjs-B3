'use client'

import ServiceCard from "@/components/Home/ServiceCard"
import { allServices } from "../../utils/utils"

export default function NosServicesPage() {
  return (
    <div className="nos-services-page ">
      <h1 className="">Nos services</h1>
      <div className="services-container">
        {allServices.map((service, index) => (
          <ServiceCard
            key={index}
            icon={service.icon}
            title={service.title}
            description={service.description}
            details={service.details}
          />
        ))}
      </div>
    </div>
  )
} 