
import { useEffect, useRef, useState } from 'react';

export const useBodyClass = (className) => {
  useEffect(() => {
    // Add the class to the body
    document.body.classList.add(className);

    // Remove the class when the component is unmounted or className changes
    return () => {
      document.body.classList.remove(className);
    };
  }, [className]);
};



export const useChatWs = (currentTicketId) => {

  const wsRef = useRef() 
  const [isConnected, setIsConnected] = useState(false)

  useEffect(()=>{
    if (currentTicketId){
    const websocket = new WebSocket(
        'ws://' + window.location.hostname + ':8008/ws/ticket/' + currentTicketId + '/'
    );

    websocket.onopen = () => setIsConnected(true)

    websocket.onclose = () => setIsConnected(false)

    wsRef.current = websocket;

    return () => websocket.close()
  
  }


  },[currentTicketId])


  return [wsRef,isConnected]

}