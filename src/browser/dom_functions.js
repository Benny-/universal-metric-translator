
const handleTextNode = (textNode) => {
    var transformedText = transformText(textNode.nodeValue);
    if(textNode.nodeValue != transformedText)
       textNode.nodeValue = transformedText;
};

// Travel the node(s) in a recursive fashion.
const walk = (node) => {
  var child, next;

  switch (node.nodeType) {
    case 1:  // Element
    case 9:  // Document
    case 11: // Document fragment
      child = node.firstChild;
      while (child) {
        next = child.nextSibling;
        walk(child);
        child = next;
      }
      break;
    case 3: // Text node
      handleTextNode(node);
      break;
    default:
      break;
  }
};

const MutationObserver = (window.MutationObserver || window.WebKitMutationObserver);
var observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if(mutation.type == 'childList') {
            for (var i = 0; i < mutation.addedNodes.length; ++i) {
               walk(mutation.addedNodes[i]);
            }
        } else if (mutation.type == 'characterData') {
            handleTextNode(mutation.target);
        }
    });
});

observer.observe(document, {
    childList: true,
    characterData: true,
    subtree: true,
});

walk(document.body);

