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
        const { type, width, height } = msg;
        if (type === "send-gif") {
          const { imgSrc, width, height } = msg?.value;
          const image = figma.createImage(imgSrc);
          const image_str = image.hash;

          const rect = figma.createGif(image_str);
          rect.resize(width, height);
          figma.currentPage.appendChild(rect);
          figma.currentPage.selection = [rect];
          figma.viewport.scrollAndZoomIntoView([rect]);
          figma.notify(`success!`);
        }
      });
    });
  };
  return (
    <AutoLayout padding={10} spacing={8}>
      <Input
        value={text}
        placeholder="dog, sun, rainbow..."
        onTextEditEnd={(e) => {
          setText(e.characters);
        }}
        fontSize={20}
        fill="#3d3d3d"
        width={256}
        inputFrameProps={{
          fill: "#e5d0ff",
          stroke: "#9747ff",
          strokeWidth: 2,
          cornerRadius: 16,
          padding: 20,
        }}
        inputBehavior="wrap"
      />
      <AutoLayout
        fill="#f6f6f6"
        width={80}
        height="fill-parent"
        cornerRadius={16}
        verticalAlignItems="center"
        horizontalAlignItems="center"
        stroke="#e6e6e6"
        onClick={HandlePasteGifOnCanvas}
        padding={{
          top: 8,
          left: 8,
          bottom: 8,
          right: 8
        }}
      >
        <Text fontSize={20} width={24}>
          ->
        </Text>
      </AutoLayout>
    </AutoLayout>
  );
}

widget.register(Widget);
