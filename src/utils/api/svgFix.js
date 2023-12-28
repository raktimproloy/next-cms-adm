export function svgFix(editor){
    const refreshSvg = () => {
      const canvasComponent = editor.DomComponents.getComponent()
      const svgComponents = canvasComponent.findType('svg')
      svgComponents.map((svgComp) => svgComp.replaceWith(svgComp.toHTML()))
    }
    editor.onReady(refreshSvg)
    editor.on('component:selected', refreshSvg)
}