const { widget } = figma;
const {
  useSyncedState,
  AutoLayout,
  Input,
  Frame,
  Text,
  useWidgetId,
  waitForTask,
  useEffect,
} = widget;

function Widget() {
  const [text, setText] = useSyncedState("text", "");

  const HandlePasteGifOnCanvas = async () => {
    await new Promise((resolve) => {
      figma.showUI(__html__, { visible: false });
      figma.ui.postMessage({ type: "networkRequest", keyword: text });

      figma.ui.on("message", (msg) => {
        const { type, width, height } = msg
        if (type === "send-gif") {
          figma.notify(`Pasting Gif...`);
          const { imgSrc, width, height } = msg?.value;
          const image = figma.createImage(imgSrc);
          const image_str = image.hash;
          
          const rect = figma.createGif(image_str);
          rect.resize(width, height)
          figma.currentPage.appendChild(rect);
          figma.currentPage.selection = [rect];
          figma.viewport.scrollAndZoomIntoView([rect]);

          figma.closePlugin();
        }
      });
    });
  };
  return (
    <AutoLayout padding={10} spacing={8}>
      <Input
        value={text}
        placeholder="Type word...ex: dog"
        onTextEditEnd={(e) => {
          setText(e.characters);
        }}
        fontSize={36}
        fill="#3d3d3d"
        width={500}
        inputFrameProps={{
          fill: "#ead6e8",
          stroke: "#9a59a8",
          strokeWidth: 2,
          cornerRadius: 16,
          padding: 20,
        }}
        inputBehavior="wrap"
      />
      <AutoLayout
        fill="#f6f6f6"
        width={"hug-contents"}
        height="fill-parent"
        cornerRadius={16}
        verticalAlignItems="center"
        horizontalAlignItems="center"
        stroke="#e6e6e6"
        onClick={HandlePasteGifOnCanvas}
      >
        <Text fontSize={24}>go</Text>
      </AutoLayout>
    </AutoLayout>
  );
}

widget.register(Widget);