import React from 'react'
import { useEffect } from 'react'

export const Search = ({searchTerm,setSearchTerm}) => {
  return (
    <div className="search ">
      <div >
         <img src="search.svg" alt="search"/>
         <input
         type="text"
         value={searchTerm}
         onChange={(e)=>setSearchTerm(e.target.value)}

         
         />
      </div>
     

    </div>
  )
}
