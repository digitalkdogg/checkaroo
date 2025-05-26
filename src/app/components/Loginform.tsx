import Form from 'next/form'
 
export default function Page() {
  return (
    <Form className = "-translate-y-50" action="/search">
      <div className = "flex my-5">
        <label htmlFor="username">Username : </label>
        <input id = "username" name="username" type = "text"  />
      </div>

      <div className = "flex my-10">
        <label htmlFor="password">Password : </label>
        <input id = "password" name="password" type = "password"  />
      </div>
      
      <br />
      <div className= "flex justify-evenly">
      <button className="inset-shadow-indigo-500" type="submit">Submit</button>
      <button type="reset">Reset</button>
      </div>
    </Form>
  )
}