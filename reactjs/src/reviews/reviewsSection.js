
import { useMutation, useQuery } from '@apollo/client'
import '../css/reviews.scss'

import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import { CREATE_REVIEW } from './gql/mutations'
import { useCookies } from 'react-cookie'
import { GET_ALL_REVIEWS } from './gql/queries'

export const ReviewSection = () => { 




  return <div className="review-section"> 
    <LeaveReviewSection/>

    <ReviewList/>

    <FullScreenImageModal/>

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

        const filesSrcArray = []
        review.attachments.map((file)=>(filesSrcArray.push(file.image)))

        return <li key={index}>
          <ReviewUsernameRow review={review}/>
          
          <ReviewUploadedFiles files={filesSrcArray}/>

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
  
  const [filesSrcArray, setFilesSrcArray] = useState([])


  

  useEffect(()=>{
    
    const newFilesArray = []

    uploadedFiles.map((file)=>{newFilesArray.push(URL.createObjectURL(file))})

    setFilesSrcArray(newFilesArray)

  }, [uploadedFiles])

  return <div className='upload-files'>

        <label>Upload up to 4 images:</label>
        <br/>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <ReviewUploadedFiles files={filesSrcArray}/>
  
  </div>
}

const ReviewUploadedFiles = ({files, ...props}) => {


  const imageModalRef = useRef()


  return <div>
    <ul className='gallery-list'>
      {files.map((file, index) => {
        return <li key={index} className='gallery-list-element'>

          <img className='gallery-list-img'
              src={file} alt='' onClick={()=>{imageModalRef.current.style.display='flex';}}/>

          <FullScreenImageModal fileSrc={file} ref={imageModalRef}/>
        </li>
      })}
    </ul>
  </div>
}


const FullScreenImageModal = forwardRef((props,ref) => {

  const closeModalOnOutsideClick = (e) => {

    e.target.style.display = 'none';

  }

  return <div className='fullscreen-image' ref={ref} onClick={closeModalOnOutsideClick}>
      <div>
        <img src={props.fileSrc}/>
      </div>

  </div>
  

})