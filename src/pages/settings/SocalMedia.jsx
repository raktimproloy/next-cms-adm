import React from 'react'
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";

function SocalMedia() {
  return (
    <Card title="Horizontal Form">
        <div className="space-y-4">
          <Textinput
            label="Facebook"
            id="facebook"
            type="text"
            placeholder="Facebook"
            horizontal
          />
          <Textinput
            label="Linkedin"
            id="linkedin"
            type="text"
            placeholder="Linkedin"
            horizontal
          />
          <Textinput
            label="Pinterest"
            id="pinterest"
            type="text"
            placeholder="Pinterest"
            horizontal
          />
          <div className="ml-[124px] space-y-4">
            <Button text="Submit" className="btn-dark" />
          </div>
        </div>
      </Card>
  )
}

export default SocalMedia