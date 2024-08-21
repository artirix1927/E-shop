
import { useMutation, useQuery } from '@apollo/client'
import '../css/reviews.scss'

import React, { useRef, useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import { CREATE_REVIEW } from './gql/mutations'
import { useCookies } from 'react-cookie'
import { GET_ALL_REVIEWS } from './gql/queries'

export const ReviewSection = () => { 




  return <div className="review-section"> 
    <LeaveReviewSection/>

    <ReviewList/>

  </div>

}

const LeaveReviewSection = () =>{
  const [rating, setRating] = useState(null)

  const [cookies] = useCookies(['user'])

  const [createReview, {data}] = useMutation(CREATE_REVIEW)

  const textareaRef = useRef()

  const handleLeaveReview = (e) => {

    createReview({variables:{userId:cookies.user.id, stars:rating, text:textareaRef.current.value, productId:1, files: uploadedFiles}})

  }

  const [uploadedFiles, setUploadedFiles] = useState([])



  return <>
      <div className='write-review'>
          <StarsRating setRating={setRating}/>

          <UploadFiles setUploadedFiles={setUploadedFiles} uploadedFiles={uploadedFiles}/>

          <textarea className='write-review-textarea' ref={textareaRef}></textarea>

          <button type="button" className="btn btn-secondary leave-review-btn" onClick={handleLeaveReview}>Leave review</button>
      </div>
  </>


}


const ReviewList = (props) => {

  let {data,loading} = useQuery(GET_ALL_REVIEWS)


  if (loading) return <></>

  data = data.allReviews; 

  return <div className='review-list-container'>

    <h5>Other Reviews</h5>
    <ul className='review-list'>
      {data.map((review,index) => {



        return <li key={index}>
          <ReviewUsernameRow review={review}/>

          <p>{review.text}</p>

        </li>
      })}



    </ul>

  </div>

}


const ReviewUsernameRow = ({review, ...props}) => {

  return <div className='review-username-row'>
    <h6>{review.user.username}</h6>
    <StarsRatingReadOnly initialValue={review.stars}/>
  </div>
  
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



const StarsRatingReadOnly = ({initialValue, ...props}) => {


  return (
    <>
      <Rating
        readonly={true}
        initialValue={initialValue}
        size={24}

      />
    </>
    
  )
}


const UploadFiles = ({setUploadedFiles, uploadedFiles, ...props}) => {

  const handleFileChange = (event) => {
    const newFile = event.target.files[0];
    if (newFile && uploadedFiles.length<4) {
      setUploadedFiles([...uploadedFiles, newFile]);
    }
  };
  

  return <div className='upload-files'>

        <label>Upload up to 4 images:</label>
        <br/>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <UploadedFilesGallery files={uploadedFiles}/>
  
  </div>
}



const UploadedFilesGallery = ({files, ...props}) => {


  return <div>
    <ul style={{margin:0, padding:0, listStyleType:'none'}}>
      {files.map((file, index) => {
        console.log(file)
        return <li key={index} style={{display:"inline"}}>

          <img style={{height:200, width:200, objectFit:"contain"}} 
                    src={URL.createObjectURL(file)} alt=''/>
        </li>
      })}
    </ul>
  </div>
}