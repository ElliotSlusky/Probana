
import {
  DynamicWidget,
} from '@dynamic-labs/sdk-react-core';

export default function Navbar() {
  return (
    <div className="flex flex-col items-center">

      <div className="text-white w-full h-[100px] flex flex-row justify-between items-center px-[40px]">
        <h1 className="text-[20px]">
          Probana
        </h1>
        <DynamicWidget />
      </div>
      <div className="w-[100%] h-[1px] bg-[rgba(255,255,255,0.3)] "/>

    </div>
  )
}