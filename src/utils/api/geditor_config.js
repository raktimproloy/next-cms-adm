import grapesjs from "grapesjs";
import gjsBlockBasic from "grapesjs-blocks-basic";
import $ from "jquery";
import grapesjsBlockBootstrap from "grapesjs-blocks-bootstrap4";
import grapesjsPluginExport from "grapesjs-plugin-export";
import grapesjsStyleBg from "grapesjs-style-bg";
import grapesjsNavbar from "grapesjs-navbar"
import customCodePlugin from 'grapesjs-custom-code';
import plugin from 'grapesjs-tailwind';
import { svgFix } from "./svgFix";

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
  toggleSidebar,
  traitManager,
} from "./geditor_utils";
import tailwindComponent from "@/plugins/tailwind";
import swiperComponent from "@/plugins/swiper";
import chartLibComponent from "@/plugins/charts";



const geditorConfig = (assets, slug) => {
  $(".panel__devices").html("");
  $(".panel__basic-actions").html("");
  $(".panel__editor").html("");
  $("#blocks").html("");
  $("#styles-container").html("");
  $("#layers-container").html("");
  $("#trait-container").html("");
  $("#assets-container").html("");

  // Content for Preview
  const navbar = $("#navbar");
  const mainContent = $("#main-content");
  const panelTopBar = $("#main-content > .navbar-light");

  const editor = grapesjs.init({
    container: "#editor",
    blockManager: 
    {
      appendTo: "#blocks",
      blocks:[
        {
          id: 'image',
          label: 'Image',
          media: `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
          </svg>`,
          // Use `image` component
          content: { type: 'image' },
          // The component `image` is activatable (shows the Asset Manager).
          // We want to activate it once dropped in the canvas.
          activate: true,
          // select: true, // Default with `activate: true`
        }
      ]
    },
    showOffsets: true,
    fromElement: true,
    noticeOnUnload: false,
    selectorManager: selectorManager,
    traitManager: traitManager,
    layerManager: layerManager,
    storageManager: storageSetting(slug),
    styleManager: styleManager,
    panels: panels,
    deviceManager: deviceManager,
    assetManager: { assets: assets, upload: true },
    canvas: {
      styles: styles,
      scripts: scripts,
    },
    plugins: [
      tailwindComponent,
      gjsBlockBasic,
      swiperComponent,
      grapesjsBlockBootstrap,
      grapesjsPluginExport,
      grapesjsStyleBg,
      chartLibComponent,
      grapesjsNavbar,
      customCodePlugin,
      plugin
    ],
    pluginsOpts: {
      tailwindComponent: {},
      grapesjsNavbar: {},
      gjsBlockBasic: {},
      swiperComponent: {},
      grapesjsBlockBootstrap: {},
      grapesjsPluginExport: {},
      grapesjsStyleBg: {},
      chartLibComponent: {},
    },
  });









  svgFix(editor)
  addEditorCommand(editor);
  editor.on("run:preview", () => {
    console.log("It will trigger when we click on preview icon");
    // This will be used to hide border
    editor.stopCommand("sw-visibility");
    // This will hide the sidebar view
    navbar.removeClass("sidebar");
    // This will make the main-content to be full width
    mainContent.removeClass("main-content");

    // This will hide top panel where we have added the button
    panelTopBar.addClass("d-none");
  });
  editor.on("stop:preview", () => {
    // This event is reverse of the above event.
    console.log("It will trigger when we click on cancel preview icon");
    editor.runCommand("sw-visibility");
    navbar.addClass("sidebar");
    mainContent.addClass("main-content");
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
