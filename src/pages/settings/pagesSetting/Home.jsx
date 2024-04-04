import React, { useEffect, useState } from 'react'
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea"
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Fileinput from "@/components/ui/Fileinput"
import { StoreMetaImage } from '@/utils/appwrite/StoreImage';
import axios from "axios"
import { API_HOST } from '@/utils'
import { useCookies } from 'react-cookie'
import { toast } from 'react-toastify'
import Popup from "@/components/ui/Popup"
import Icon from "@/components/ui/Icon"
import Tooltip from "@/components/ui/Tooltip"

import cardImage3 from "@/assets/images/all-img/card-3.png";
import { getSetting } from '../../../utils/getSetting';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addInfo } from '../../../store/layout';
import Switch from "@/components/ui/Switch";

function Home({settingData, setSettingData}) {
  const [showLoading, setShowLoading] = useState(false)
  const [modalAddButtonInfo, setModalAddButtonInfo] = useState("add")
  const [showSliderModal, setShowSliderModal] =useState(false)
  const updateInfo = useSelector((state) => state.update);
  const [selectedBgImage, setSelectedBgImage] = useState(null)
  const [sliderData, setSliderData] = useState({
    title: "",
    description: "",
    button_title: "",
    button_link: "",
    video: ""
  })

  const dispatch = useDispatch()
  // Cookies
  const [cookie, removeCookie] = useCookies()
  const headers = {
  'Authorization': `Bearer ${cookie._token}`
  }

  useEffect(() => {
    if (updateInfo.settingUpdate === "" || updateInfo.settingUpdate === "not-updated") {
        getSetting(dispatch, cookie, removeCookie);
    }
  }, [dispatch, settingData, updateInfo]);

  const handleImageChange = (e) => {
    setSelectedBgImage(e.target.files[0]);
  };


  const handleAddSlider = async () => {
    setShowLoading(true)
    if(modalAddButtonInfo === "add"){
      if (selectedBgImage) {
        const bg_url = await StoreMetaImage(selectedBgImage, settingData?.storage_config?.storage_meta_bucket_id);
        const newSliderData = {
          ...sliderData,
          background_image: bg_url
        }
        axios.post(`${API_HOST}setting/page/home/add`, newSliderData, {
          headers: headers
        })
        .then(res => {
          console.log(res)
          setShowSliderModal(false)
          setSliderData({
            title: "",
            description: "",
            button_title: "",
            button_link: "",
            video: ""
          })
          dispatch(addInfo({ field: 'settingUpdate', value: 'not-updated' }));
          setShowLoading(false)
          toast.success("Slider Added Successful!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        })
        .catch(err => {
          setShowLoading(false)
          toast.error("Slider Added Unsuccessful!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        })
      }else{
        toast.error("Add a Background Image", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }else{
      let bg_url = sliderData.background_image
      if(selectedBgImage) {
        bg_url = await StoreMetaImage(selectedBgImage, settingData?.storage_config?.storage_meta_bucket_id);
      }
      const newData ={
        ...sliderData,
        background_image: bg_url
      }
      axios.post(`${API_HOST}setting/page/home/edit`, newData, {
        headers: headers
      })
      .then(res => {
        console.log(res)
        setShowSliderModal(false)
        setSliderData({
          title: "",
          description: "",
          button_title: "",
          button_link: "",
          video: ""
        })
        dispatch(addInfo({ field: 'settingUpdate', value: 'not-updated' }));
        setShowLoading(false)
        toast.success("Slider Edited Successful!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch(err => {
        setShowLoading(false)
        toast.error("Slider Edited Unsuccessful!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
    }
  }

  const handleShowEditSlider = async (id) => {
    setModalAddButtonInfo("edit")
    const sliders = settingData.page.home.sliders
    const sliderObj = sliders.find(obj => obj._id === id);
    setSliderData({
      id: id,
      background_image: sliderObj.background_image,
      title: sliderObj.title,
      description: sliderObj.description,
      button_title: sliderObj.button_title,
      button_link: sliderObj.button_link,
      video: sliderObj.video
    })
    setShowSliderModal(true)
    
  }

  const handleDeleteSlider = async (id) => {
    const newSliderData = {
      id
    }
    axios.post(`${API_HOST}setting/page/home/delete`, newSliderData, {
      headers: headers
    })
    .then(res => {
      setShowSliderModal(false)
      setSliderData({
        title: "",
        description: "",
        button_title: "",
        button_link: "",
        video: ""
      })
      dispatch(addInfo({ field: 'settingUpdate', value: 'not-updated' }));
      setShowLoading(false)
      toast.success("Slider Deleted Successful!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    })
    .catch(err => {
      setShowLoading(false)
      toast.error("Slider Deleted Unsuccessful!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    })
  }


  const [staticActive, setStaticActive] = useState(settingData.page.home.static_hero_section);
  const [sliderActive, setSliderActive] = useState(settingData.page.home.slider_hero_section);

  const handleStaticChange = () => {
    setStaticActive(!staticActive);
    setSliderActive(false); // Deactivate the slider switch
    setSettingData(prevSettingData => ({
      ...prevSettingData,
      page: {
        ...prevSettingData.page,
        home: {
          ...prevSettingData.page.home,
          static_hero_section: !staticActive,
          slider_hero_section: false // Deactivate slider_hero_section when static_hero_section is active
        }
      }
    }));
  };
  
  const handleSliderChange = () => {
    setSliderActive(!sliderActive);
    setStaticActive(false); // Deactivate the static switch
    setSettingData(prevSettingData => ({
      ...prevSettingData,
      page: {
        ...prevSettingData.page,
        home: {
          ...prevSettingData.page.home,
          static_hero_section: false, // Deactivate static_hero_section when slider_hero_section is active
          slider_hero_section: !sliderActive
        }
      }
    }));
  };

  return (
    <>
      <Popup showLoading={showLoading} popupText={"Slider Adding..."}  />
        <Modal
          title="Add New Slider"
          label=""
          labelClass="btn-outline-success p-1 "
          themeClass="bg-success-500"
          activeModal={showSliderModal}
          onClose={() => {
            setShowSliderModal(false)
          }}
          footerContent={
            <Button
              text="Add"
              className="btn-success "
              onClick={handleAddSlider}
            />
          }
        >
          <h4 className="font-medium text-lg mb-3 text-slate-900">
            Add New Slider
          </h4>
          <div className="text-base text-slate-600 dark:text-slate-300">
            <Fileinput
              label="Slider Background Image"
              name="og_image"
              selectedFile={selectedBgImage}
              onChange={handleImageChange}
            />
            <Textinput
                label="Slider Title"
                id="pn2"
                type="text"
                placeholder="Type Your Slider Title"
                defaultValue={sliderData.title}
                onChange={(e) => setSliderData({...sliderData, title:e.target.value})}
            />
            <Textinput
                label="Slider Description"
                id="pn2"
                type="text"
                placeholder="Type Your Slider Description"
                defaultValue={sliderData.description}
                onChange={(e) => setSliderData({...sliderData, description:e.target.value})}
            />
            <Textinput
                label="Slider Button Title"
                id="pn2"
                type="text"
                placeholder="Type Your Slider Button Title"
                defaultValue={sliderData.button_title}
                onChange={(e) => setSliderData({...sliderData, button_title:e.target.value})}
            />
            <Textinput
                label="Slider Button Link"
                id="pn2"
                type="text"
                placeholder="Type Your Slider Button Link"
                defaultValue={sliderData.button_link}
                onChange={(e) => setSliderData({...sliderData, button_link:e.target.value})}
            />
            <Textarea
                label="Watch Video Link"
                id="pn2"
                type="text"
                placeholder="Type Your Watch Video Link"
                defaultValue={sliderData.video}
                onChange={(e) => setSliderData({...sliderData, video:e.target.value})}
            />
          </div>
        </Modal>
        <div className='pb-5 flex'>
          <span className='mr-3'>Active Static Image</span>
          <Switch
            label="Static Hero Status"
            activeClass="bg-danger-500"
            value={staticActive}
            onChange={handleStaticChange}
          />
        </div>
        <div className='my-5'>
        <div className='flex justify-between mb-5'>
          <div className='flex'>
          <label htmlFor="" className='pb-3 mr-3'>Active Sliders</label> 
          <Switch
            label="Slider Hero Status"
            activeClass="bg-danger-500"
            value={sliderActive}
            onChange={handleSliderChange}
          />
          </div>
          <Button text="Add Slider" className="btn-success py-2" onClick={() => {
            setModalAddButtonInfo("add")
            setSelectedBgImage(null)
            setSliderData({
              title: "",
              description: "",
              button_title: "",
              button_link: "",
              video: ""
            })
            setShowSliderModal(true)
          }}  />
        </div>
        <div className='grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3'>
          {settingData && settingData.page.home.sliders.map((slider, index) =>
            <Card bodyClass="p-0 relative z-[1] rounded" noborder key={index}>
              <div className="absolute left-0 top-0 w-full h-full rounded-md z-[-1] ">
                <img
                  src={`${settingData?.storage_config?.storage_url}${slider?.background_image}`}
                  alt=""
                  className="block w-full h-full object-cover rounded"
                />
              </div>

              <div className="p-6">
                <div className='flex justify-end'>
                  <Tooltip content="Edit" placement="top" arrow animation="shift-away">
                    <button className="action-btn btn-outline-success mr-3" type="button" onClick={() => 
                      handleShowEditSlider(slider._id)
                    }>
                      <Icon icon="heroicons:pencil" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Delete" placement="top" arrow animation="shift-away">
                    <button className="action-btn btn-outline-success mr-3" type="button" onClick={() => 
                      handleDeleteSlider(slider._id)
                    }>
                      <Icon icon="heroicons:trash" />
                    </button>
                  </Tooltip>
                </div>
                <header className="mb-5">
                  <div className="card-title text-white">{slider?.title}</div>
                </header>

                <div className="text-white mt-[70px]">
                  <div className="text-sm">
                    {slider?.description}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
        </div>
    </>
  )
}

export default Home