import React from 'react';
import ReactDOM from 'react-dom';
import { convertFromRaw, EditorState } from 'draft-js';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import createImagePlugin from 'draft-js-image-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import createDndUploadPlugin from '@mikeljames/draft-js-drag-n-drop-upload-plugin';

import 'draft-js-image-plugin/lib/plugin.css';
import editorStyles from './editorStyles.css';
// import mockUpload from './mockUpload';


const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();
const { AlignmentTool } = alignmentPlugin;

console.log(typeof alignmentPlugin.decorator)
const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
  blockDndPlugin.decorator
);

const imagePlugin = createImagePlugin({ decorator });

const dndFileUploadPlugin = createDndUploadPlugin({
  //handleUpload: mockUpload,
  addImage: imagePlugin.addImage
});

const plugins = [
  dndFileUploadPlugin,
  blockDndPlugin,
  focusPlugin,
  alignmentPlugin,
  resizeablePlugin,
  imagePlugin
];

const initialState = {
  "entityMap": {
    "0": {
      "type": "IMAGE",
      "mutability": "IMMUTABLE",
      "data": {
        "src": "https://car-images.bauersecure.com/pagefiles/79892/1040x585/best_electric_car_2019_uk.jpg"
      }
    }
  },
  "blocks": [{
    "key": "9gm3s",
    "text": "You can have images in your text field. This is a very rudimentary example, but you can enhance the image plugin with resizing, focus or alignment plugins.",
    "type": "unstyled",
    "depth": 0,
    "inlineStyleRanges": [],
    "entityRanges": [],
    "data": {}
  }, {
    "key": "ov7r",
    "text": " ",
    "type": "atomic",
    "depth": 0,
    "inlineStyleRanges": [],
    "entityRanges": [{
      "offset": 0,
      "length": 1,
      "key": 0
    }],
    "data": {}
  }, {
    "key": "e23a8",
    "text": "See advanced examples further down …",
    "type": "unstyled",
    "depth": 0,
    "inlineStyleRanges": [],
    "entityRanges": [],
    "data": {}
  }]
};


class ResizableImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createWithContent(convertFromRaw(initialState))
    };
    this.editor = React.createRef();
  }

  onChange = (editorState) => {
    this.setState({
      editorState
    });
  };

  focus = () => {
    this.editor.current.focus();
  };

  render() {
    return (
      <div>
        <div className={editorStyles.editor} onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
            ref={this.editor}
          />
          <AlignmentTool />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<ResizableImage />, document.getElementById('root'));
