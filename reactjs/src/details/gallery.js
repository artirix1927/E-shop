import { useEffect, useRef, useState } from "react";




export const Gallery = (props) => {
    const [currentImageSrc, setCurrentImageSrc] = useState(props.attachments[0].image)
    
    //li element ref to highlight active photo
    const currentImageLiRef = useRef()

    //img tag ref to change the height and width
    const currentImageRef = useRef()

    //aligning image height to buy card height
    useEffect(() => {
        
        const buyCardHeight = props.buyCardRef.current.offsetHeight;
        
        currentImageRef.current.style.height = `${buyCardHeight}px`
        currentImageRef.current.style.width = `${buyCardHeight}px`
    });


    const HandleImageClick = (e) => {
        const clickedImage = e.target
        const newImageLiElem = e.target.parentElement;

        currentImageLiRef.current.classList.remove('active')
        newImageLiElem.classList.add('active')
        
        currentImageLiRef.current = newImageLiElem;
        setCurrentImageSrc(clickedImage.src)
    }

    return <>
        <ul className='gallery-images'>
                        {props.attachments.map((obj, index)=>{
                            if (index===0)
                                return <li key={index} className='active' ref={currentImageLiRef}><img src={obj.image} alt="" key={index} onClick={HandleImageClick}></img></li>

                            return <li key={index}><img src={obj.image} alt="" key={index} onClick={HandleImageClick}></img></li>
                          
                        })}
            
        </ul>
        <div>
            <img ref={currentImageRef} src={currentImageSrc} alt='...'></img>
        </div>

    </>
}