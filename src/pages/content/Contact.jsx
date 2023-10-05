import React from 'react'
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";

function Contact() {
  return (
    <Card title="Horizontal Form">
        <div className="space-y-4">
          <Textinput
            label="Full name"
            id="h_Fullname"
            type="text"
            placeholder="Full name"
            horizontal
          />
          <Textinput
            label="Email"
            id="h_email"
            type="email"
            placeholder="Type your email"
            horizontal
          />
          <Textinput
            label="Phone"
            id="h_phone"
            type="phone"
            placeholder="Type your email"
            horizontal
          />
          <Textinput
            label="Password"
            id="h_password"
            type="Password"
            placeholder="8+ characters, 1 capitat letter "
            horizontal
          />
          <div className="ml-[124px] space-y-4">
            <Button text="Submit" className="btn-dark" />
          </div>
        </div>
      </Card>
  )
}

export default Contact