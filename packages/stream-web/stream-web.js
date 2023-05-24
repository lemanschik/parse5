/** @markdown {} 
# A WebSreams Implementation with fallback to node:stream/web if not running in the browser
import the index.js for the conditional export 
import this stream-web.js for the web version
import stream-web.node.js for the nodejs only version
*/

const ParserStream = import('parse5-parser-stream');
const http = require('http');
const { finished } = require('node:stream');

// TODO i need to handle that maybe directly in the tree adapter popUntil stuff. if that would be a stream 
// i would need no logic to compare the childNodeChanges but maybe child node changes are cool?

export const ReadableHTMLDocumentStream = (readableOrPromise) => new ReadableStream({async start(reader){
  for await (const reading of await readableOrPromise) {
    reader.enqueue(reading);
  }
}}).pipeThrough(new TransformStream({ 
  start(){ 
    this.parser = new ParserStream();    
  },
  transform(html,domTree){
    this.parser.write(html);
    domTree.enqueue({ document: parser.document })
}}));

                
ReadableHTMLDocumentStream(fetch('https://inikulin.github.io/parse5/').then(
  (r)=>r.body)).pipeTrough(new TransformStream({transform(mutation,layoutRender){
  mutation?.childNodes[1]?.childNodes[0]?.tagName && 
    console.log(mutation.childNodes[1].childNodes[0].tagName); //> 'head'
    const default0 = (x) => x || 0;
    const childNodeRendered = default0(this.childNodesLenght) === mutation.childNodes.length
    
    this.childNodesLenght = mutation.childNodes[this.currentChildNode].length;
    this.currentChildNode = default0(this.currentChildNode);
    childNodeRendered && layoutRender.enqeueue(mutation.childNodes[this.currentChildNode]);
    
  
}}).pipeTo(new WriteableStream({write(domTree){
  const position = (this.currentPosition = this.currentPosition || o);
  this.openElement.domTree.childNodes[position++]
}}));
                                                                                                 
// Fetch the page content and obtain it's <head> node
http.get('http://inikulin.github.io/parse5/', res => {
    const parser = new ParserStream();

    finished(parser, () => {
        console.log(parser.document.childNodes[1].childNodes[0].tagName); //> 'head'
    });

    res.pipe(parser);
});
