class CanvasShapes {
  /**
   * Draws an double-ended arrow on the provided canvas context.
   * @param context   The canvas context to draw on.
   * @param fromx     Starting X co-ordinate.
   * @param fromy     Starting Y co-ordinate.
   * @param tox       Ending X co-ordinate.
   * @param toy       Ending Y co-ordinate.
   */
  drawArrow (context, fromx, fromy, tox, toy) {
    var headlen = 10   // length of head in pixels
    var angle = Math.atan2(toy - fromy, tox - fromx)
    context.beginPath()
    context.moveTo(fromx, fromy)
    // Start arrow head
    context.lineTo(fromx + headlen * Math.cos(angle + Math.PI / 6), fromy + headlen * Math.sin(angle + Math.PI / 6))
    context.moveTo(fromx, fromy)
    context.lineTo(fromx + headlen * Math.cos(angle - Math.PI / 6), fromy + headlen * Math.sin(angle - Math.PI / 6))

    context.moveTo(fromx, fromy)

    // End arrow head
    context.lineTo(tox, toy)
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6))
    context.moveTo(tox, toy)
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6))
    context.stroke()
  }
}
export let canvasShapes = new CanvasShapes()

