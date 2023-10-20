import React from 'react'
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput"
import Button from "@/components/ui/Button";

function userEdit() {
  return (
    <div>
        <Card title="Basic Inputs">
        <div className="space-y-3">
          <Textinput
            label="Full Name"
            id="pn"
            type="text"
            placeholder="Change Full Name"
          />
          <Textinput
            label="Username"
            id="pn3"
            placeholder="Enter Username"
            readonly
            type="text"
          />
          <Textinput
            label="Email"
            id="pn2"
            type="text"
            placeholder="Change Email"
          />
          <Textinput
            label="Phone Number"
            id="pn4"
            type="text"
            placeholder="Change Phone Number"
          />
          <Button text="Update" className="btn-primary py-2" />
        </div>
      </Card>
    </div>
  )
}

export default userEdit