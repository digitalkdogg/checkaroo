'use client'

import Input from "@/app/components/Input";
import Button from '@/app/components/Button'

interface Props {
  session: string;
}



export default function AddForm(prop:Props) {

    const handleSubmit = (formData: FormData) => {
        console.log('Form data from custom button:', Object.fromEntries(formData.entries()));
        // Handle form submission logic here (e.g., client-side API call)
      };

      const getData = (event: React.MouseEvent<HTMLButtonElement>) => {

        const formData = new FormData(event.currentTarget.form as HTMLFormElement);
        return ['hello', 'hiagain']
      }



  return (
        <div>
            <form className="max-w-280"> 
                <div className = "flex flex-col md:flex-row justify-left py-5">
                    <span className="md:basis-32">Category Name :</span>
                    <Input val = '' id = 'CategoryName' name = 'CategoryName' disabled = {false} />
                </div>
                 <div className= "flex flex-col sm:flex-row justify-center-safe mb-10 mt-10">
                    <Button 
                        onSubmit={handleSubmit} 
                        text = "Add Category" 
                        session={prop.session} 
                        url="/api/categories/add" 
                        payload = {['CategoryName']} />
                </div>
            </form>
        </div>
    )    

}