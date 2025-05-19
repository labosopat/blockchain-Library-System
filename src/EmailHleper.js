import "./App.css";
import { useRef, useEffect, useState } from "react";
import emailjs from "@emailjs/browser";

function EmailHelper () {
//     const emailRef = useRef<HTMLInputElement>();
// const nameRef = useRef<HTMLInputElement>();
const [loading, setLoading] = useState(false);

    useEffect(() => emailjs.init("YOUR-PUBLIC-KEY-HERE"), []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("test submit");
        const serviceId = "YOUR-SERVICE-ID-HERE";
        const templateId = "YOUR-TEMPLATE-ID-HERE";
        try {
          setLoading(true);
          await emailjs.send(serviceId, templateId, {
            from_name: "test from name",
            to_name: "test to name",
            to_mail: "krishkarthick2a@gmail.com",
            email: "krishkarthick2a@gmail.com"
          });
          alert("email successfully sent check inbox");
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

  return (<section>
    <aside></aside>
    <form className="for" onSubmit={handleSubmit}>
      <div className="form_group">
        <label htmlFor="">name</label>
        <input placeholder="enter your name" />
      </div>
      <div className="form_group">
        <label htmlFor="">email</label>
        <input type="email" placeholder="enter your email" />
      </div>
      <button className="btn" disabled={loading}>
        subscribe
      </button>
    </form>
  </section>
  );
}

export default EmailHelper;
