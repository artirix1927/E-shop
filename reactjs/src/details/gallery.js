import { useEffect, useRef, useState } from "react";



export const Gallery = (props) => {
    const [currentImageSrc, setCurrentImageSrc] = useState(props.attachments[0] ? props.attachments[0].image : null);
    const [activeIndex, setActiveIndex] = useState(0);

    const HandleImageClick = (index, imageSrc) => {
        setActiveIndex(index);
        setCurrentImageSrc(imageSrc);
    };

    return (
        <>
            <ul className="gallery-images">
                {props.attachments.map((obj, index) => (
                    <li
                        key={index}
                        className={activeIndex === index ? 'active' : ''}
                        onClick={() => HandleImageClick(index, obj.image)}>
                        <img src={obj.image} alt="" />
                    </li>
                ))}
            </ul>

            <div className="main-image-container">
                <img src={currentImageSrc} alt="Main" className="main-image" />
            </div>
        </>
    );
};
