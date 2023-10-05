import React, { useState } from 'react'
import Card from "@/components/ui/Card";
import Fileinput from "@/components/ui/Fileinput";

function Logo() {
  
  const [selectedFile2, setSelectedFile2] = useState(null);
  const handleFileChange2 = (e) => {
    setSelectedFile2(e.target.files[0]);
  };
  return (
    <Card title="File Input Basic With Preview">
        <Fileinput
          name="basic"
          selectedFile={selectedFile2}
          onChange={handleFileChange2}
          preview
        />
      </Card>
  )
}

export default Logo