import grapesjs from "grapesjs";
import gjsBlockBasic from "grapesjs-blocks-basic";
import $ from "jquery"
// import grapesjsBlockBootstrap from "grapesjs-blocks-bootstrap4"; // Commented out as it might be causing compatibility issues
import grapesjsPluginExport from "grapesjs-plugin-export";
import grapesjsStyleBg from "grapesjs-style-bg";
import grapesjsNavbar from "grapesjs-navbar";

import {
  addEditorCommand,
  deviceManager,
  layerManager,
  panels,
  scripts,
  selectorManager,
  storageSetting,
  styleManager,
  styles,
  traitManager,
  toggleSidebar,
} from "./geditor_utils";
import tailwindComponent from "@/plugins/tailwind";
import swiperComponent from "@/plugins/swiper";
import chartLibComponent from "@/plugins/charts";

import grapesjsParserPostcss from 'grapesjs-parser-postcss';

const geditorConfig = (assets, pageId) => {
  $(".panel__devices").empty();
  $(".panel__basic-actions").empty();
  $(".panel__editor").empty();
  $("#blocks").empty();
  $("#styles-container").empty();
  $("#layers-container").empty();
  $("#trait-container").empty();

  // Content for Preview
  const navbar = $("#navbar");
  const mainContent = $("#main-content");
  const panelTopBar = $("#main-content > .navbar-light");
  const editor = grapesjs.init({
    container: "#editor",
    blockManager: {
      appendTo: "#blocks",
    },
    styleManager: styleManager,
    layerManager: layerManager,
    traitManager: traitManager,
    selectorManager: selectorManager,
    panels: panels,
    deviceManager: deviceManager,
    assetManager: { assets: assets, autosave: false }, // 'upload' option has been removed
    storageManager: storageSetting(pageId),
    canvas: {
      styles: styles,
      scripts: scripts,
    },
    plugins: [
      tailwindComponent,
      gjsBlockBasic,
      swiperComponent,
      // grapesjsBlockBootstrap,
      grapesjsPluginExport,
      grapesjsStyleBg,
      chartLibComponent,
      grapesjsNavbar,
      // grapesjsParserPostcss
    ],
  });
  
  // const editor = grapesjs.init({
  //   container: '#editor',
  //   // Get the content for the canvas directly from the element
  //   // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
  //   fromElement: true,
  //   height: '300px',
  //   width: 'auto',
  //   storageManager: storageSetting(pageId),
  //   blockManager: {
  //     appendTo: '#blocks',
  //     blocks: [
  //       {
  //         id: 'section', // id is mandatory
  //         label: '<b>Section</b>', // You can use HTML/SVG inside labels
  //         attributes: { class:'gjs-block-section' },
  //         content: `<section>
  //           <h1>This is a simple title</h1>
  //           <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
  //         </section>`,
  //       },
  //     ]
  //   }
  // });
  addEditorCommand(editor);
  editor.on('frame:load:before', ({ el }) => {
    const doc = el.contentDocument;
    doc.open();
    doc.write("<!DOCTYPE html>");
    doc.close();
  });

  editor.on("run:preview", () => {
    console.log("It will trigger when we click on preview icon");
    // This will be used to hide border
    editor.runCommand("core:component-select");
    // This will hide the sidebar view
    navbar.addClass("d-none");
    // This will make the main-content to be full width
    mainContent.addClass("d-none");
    // This will hide top panel where we have added the button
    panelTopBar.addClass("d-none");
  });
  editor.on("stop:preview", () => {
    // This event is the reverse of the above event.
    console.log("It will trigger when we click on cancel preview icon");
    editor.stopCommand("core:component-select");
    navbar.removeClass("d-none");
    mainContent.removeClass("d-none");
    panelTopBar.removeClass("d-none");
  });
  
  editor.on("component:selected", (component) => {
    const newTool = {
      icon: "fa fa-plus-square",
      title: "Check Toolbar",
      commandName: "new-tool-cmd",
      id: "new-tool",
    };

    const defaultToolbar = component.get("toolbar");
    const checkAlreadyExist = defaultToolbar.find(
      (toolbar) => toolbar.command === newTool.commandName
    );
    if (!checkAlreadyExist) {
      defaultToolbar.unshift({
        id: newTool.id,
        attributes: { class: newTool.icon, title: newTool.title },
        command: newTool.commandName,
      });
      component.set("toolbar", defaultToolbar);
    }
  });

  setTimeout(() => {
    let categories = editor.BlockManager.getCategories();
    categories.each((category) => category.set("open", false));
  }, 1000);
  return editor;
};

export default geditorConfig;
