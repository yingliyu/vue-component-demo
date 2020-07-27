export default [
  {
    nodeId: 'O-1',
    parentNodeId: null,
    width: 200,
    height: 30,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: { red: 15, green: 140, blue: 121, alpha: 1 },
    backgroundColor: { red: 0, green: 81, blue: 90, alpha: 1 },
    nodeIcon: {
      icon: 'https://to.ly/1yZnX',
      size: 30
    },
    nodeImage: {
      url: '',
      width: 100,
      height: 100,
      centerTopDistance: 0,
      centerLeftDistance: 0,
      cornerShape: 'ORIGINAL',
      shadow: false,
      borderWidth: 0,
      borderColor: {
        red: 19,
        green: 123,
        blue: 128,
        alpha: 1
      }
    },
    template: '<span>Tree Father</span>',
    connectorLineColor: { red: 11, green: 123, blue: 108, alpha: 1 },
    connectorLineWidth: 5,
    dashArray: '',
    expanded: false,
    directSubordinates: 4,
    totalSubordinates: 1515
  },
  {
    nodeId: 'O-2',
    parentNodeId: 'O-1',
    width: 200,
    height: 30,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: { red: 15, green: 140, blue: 121, alpha: 1 },
    backgroundColor: { red: 0, green: 81, blue: 90, alpha: 1 },
    nodeIcon: {
      size: 50
    },
    nodeImage: {
      url: '',
      width: 100,
      height: 100,
      centerTopDistance: 0,
      centerLeftDistance: 0,
      cornerShape: 'ROUNDED',
      shadow: false,
      borderWidth: 0,
      borderColor: {
        red: 19,
        green: 123,
        blue: 128,
        alpha: 1
      }
    },
    template: '<span>Son1 </span>',
    connectorLineColor: { red: 11, green: 123, blue: 108, alpha: 1 },
    connectorLineWidth: 5,
    dashArray: '',
    expanded: false,
    directSubordinates: 9,
    totalSubordinates: 812
  },
  {
    nodeId: 'O-3',
    parentNodeId: 'O-1',
    width: 200,
    height: 30,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: { red: 15, green: 140, blue: 121, alpha: 1 },
    backgroundColor: { red: 0, green: 81, blue: 90, alpha: 1 },
    nodeIcon: {
      size: 50
    },
    nodeImage: {
      url: '',
      width: 100,
      height: 100,
      centerTopDistance: 0,
      centerLeftDistance: 0,
      cornerShape: 'ORIGINAL',
      shadow: false,
      borderWidth: 0,
      borderColor: {
        red: 19,
        green: 123,
        blue: 128,
        alpha: 1
      }
    },
    template: '<span>Son2</span>',
    connectorLineColor: { red: 11, green: 123, blue: 108, alpha: 1 },
    connectorLineWidth: 5,
    dashArray: '',
    expanded: false,
    directSubordinates: 3,
    totalSubordinates: 413
  }
]
