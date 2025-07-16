    'use client';

  import { useState, useEffect } from 'react';
  import Loading from '@/app/components/Loading';
  import { superEcnrypt, encrypt } from '@/common/crypt';

    interface props {
      onSubmit: (data: FormData) => void;
      text: string
      session: string
      url: string
      payload: any
    }

    interface Err {
        message?: string
    }

   export default function CustomSubmitButton({ onSubmit, text, session, url, payload }: props) {
       // const [data, setData] = useState<any>()
        const [isLoading, setIsLoading] = useState(true);
      //  const [errorClient, setErrorClient] = useState<Err>();

     
        useEffect(() => {
            setIsLoading(false)
        }, []);

        const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
            const formData = new FormData(event.currentTarget.form as HTMLFormElement);
            setIsLoading(true)

            //console.log(formData.get(payload[0]))
            let dataobj:any = {}

            payload.forEach((item:string, index:number) => {
                console.log(`Element at index ${index}: ${item}`);
                dataobj[item] = formData.get(item)
                // Perform other side effects here
            })
          //  payload.array.forEach(element:[] => {
            //    dataobj[element] = 'test' 
          //  });


     
            const data = JSON.stringify(dataobj)
            console.log(data);

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session: superEcnrypt(session),
                    data: encrypt(data)
                })
            })
    
            if (!response.ok) {

            } else {
                console.log(response);
            }
           // onSubmit(formData);
        };

      return (
        <button className = "btn" type="button" onClick={handleClick}>
            {isLoading && <span className = "inline-flex relative top-1 -left-2" id = "loadingspan"><Loading size={6} /></span>}
            {text}
        </button>
      );
    }