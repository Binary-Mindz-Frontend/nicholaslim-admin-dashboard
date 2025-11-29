import { useNavigate } from "react-router-dom"
import CustomButton from "../_components/CustomButton"
import VTtablesData from "./_components/VTtablesData"


const VehicleTypes = () => {
    const navigate = useNavigate()
  return (
    <div className="mt-12 ">
        <div className="flex justify-between">
                   <h1 className="text-3xl font-bold text-gray-900 ">Vehicle Types</h1>
                   <div className="flex  gap-2">
                    <CustomButton
                        bgColor="#FFEA96"
                       borderColor="#E2E8F0"
                        indicatorColor="#2D9CDB"
                        text="All vehicles (245)"
                        click={() => alert("All vehicles (245) Clicked!")}
                    />
                    <CustomButton
                        bgColor="#FFE16B40"
                       borderColor="#E2E8F0"
                        indicatorColor="#FF8D28"
                        text="Bikes (128)"
                        click={() => alert("Bikes (128) Clicked!")}
                    />
                    <CustomButton
                        bgColor="#FFE16B40"
                       borderColor="#E2E8F0"
                        indicatorColor="#27C840"
                        text="Cars (89)"
                        click={() => alert("Cars (89) Clicked!")}
                    />
                    <CustomButton
                        bgColor="#FFE16B40"
                       borderColor="#E2E8F0"
                        indicatorColor="#00C3D0"
                        text="Van (20)"
                        click={() => alert("Van (20) Clicked!")}
                    />  
                    <CustomButton
                       bgColor="#FFE16B40"
                       borderColor="#E2E8F0"
                        indicatorColor="#FF383C"
                        text="Truck (5)"
                        click={() => alert("Truck (5) Clicked!")}
                    />
                   </div>
        </div>
        <div className="my-12">
            <VTtablesData />
        </div>
        <div className="flex justify-center ">
            <button onClick={()=> navigate("/vehicle-pricing-page")} className="bg-[#FFCC00] rounded-md py-2 px-8 cursor-pointer">
                Add Vehicle Type
            </button>
            <div className="w-[25%]">

            </div>
        </div>
    </div>
  )
}

export default VehicleTypes