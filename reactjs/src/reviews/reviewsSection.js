
import { useMutation } from '@apollo/client'
import '../css/reviews.scss'

import React, { useRef, useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import { CREATE_REVIEW } from './gql/mutations'
import { useCookies } from 'react-cookie'

export const ReviewSection = () => { 




  return <div className="review-section"> 
    <LeaveReviewSection/>

  </div>

}

const LeaveReviewSection = () =>{
  const [rating, setRating] = useState(null)

  const [cookies] = useCookies(['user'])

  const [createReview, {data}] = useMutation(CREATE_REVIEW)

  const textareaRef = useRef()

  const handleLeaveReview = (e) => {

    createReview({variables:{userId:cookies.user.id, stars:rating, text:textareaRef.current.value, productId:1}})

  }

  return <>
      <div className='write-review'>
          <StarsRating setRating={setRating}/>

          <textarea style={{width:"100%", height: "150px", borderRadius:8}} ref={textareaRef}></textarea>

          <button type="button" className="btn btn-secondary" style={{float:'right'}} onClick={handleLeaveReview}>Leave review</button>
      </div>
  </>


}



const StarsRating = ({setRating, ...props}) => {


  const handleRating = (rate) => {
    setRating(rate)
  }


  return (
    <>
      <Rating
        onClick={handleRating}
        showTooltip={true}

      />
    </>
    
  )
}