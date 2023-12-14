import React, { useState } from 'react'
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";

function Contact() {
  const [disableEdit, setDisableEdit] = useState(true)

  return (
    <Card title="Horizontal Form">
        <div className="space-y-4">
          <Textinput
            label="Email"
            id="h_email"
            type="email"
            placeholder="Type your email"
            horizontal
            disabled={disableEdit}
          />
          <Textinput
            label="Bd Address"
            id="bd_address"
            type="text"
            placeholder="BD Address"
            horizontal
            disabled={disableEdit}
          />
          <Textinput
            label="Bd Map Url"
            id="bd_map_url"
            type="text"
            placeholder="BD Map Url"
            horizontal
            disabled={disableEdit}
          />
          <Textinput
            label="Uk Address"
            id="uk_address"
            type="text"
            placeholder="UK Address"
            horizontal
            disabled={disableEdit}
          />
          <Textinput
            label="Uk Map Url"
            id="uk_map_url"
            type="text"
            placeholder="UK Map Url"
            horizontal
            disabled={disableEdit}
          />
          <Textinput
            label="Bd Phone"
            id="bd_phone"
            type="text"
            placeholder="Your BD Phone Number"
            horizontal
            disabled={disableEdit}
          />
          <Textinput
            label="Uk Phone"
            id="uk_phone"
            type="text"
            placeholder="Your UK Phone Number"
            horizontal
            disabled={disableEdit}
          />
          <div className="ml-[124px] space-y-4">
            <Button text="Submit" className="btn-success me-4" />
            <Button text="Edit" className="btn-dark" onClick={() => setDisableEdit(!disableEdit)} />
          </div>
        </div>
      </Card>
  )
}

export default Contact