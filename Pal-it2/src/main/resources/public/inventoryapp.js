const API_URL = `http://localhost:8080`

function fetchInventoryData() {
  fetch(`${API_URL}/api/application-users/user/2`)
    .then((res) => {
      //console.log("res is ", Object.prototype.toString.call(res));
      return res.json();
    })
    .then((data) => {
      showPaintList(data.ownedPaints)
    })
    .catch((error) => {
      console.log(`Error Fetching data : ${error}`)
      document.getElementById('posts').innerHTML = 'Error Loading Paint Data'
    })
}


function fetchPaint(paintid) {
  fetch(`${API_URL}/api/paints/${paintid}`)
    .then((res) => {
      //console.log("res is ", Object.prototype.toString.call(res));
      return res.json();
    })
    .then((data) => {
      showPaintDetail(data)
    })
    .catch((error) => {
      console.log(`Error Fetching data : ${error}`)
      document.getElementById('posts').innerHTML = 'Error Loading Single Paint Data'
    })
}

function parsePaintId() {
  try {
    var url_string = (window.location.href).toLowerCase();
    var url = new URL(url_string);
    var paintid = url.searchParams.get("paintid");
    // var geo = url.searchParams.get("geo");
    // var size = url.searchParams.get("size");
    // console.log(name+ " and "+geo+ " and "+size);
    return paintid
  } catch (err) {
    console.log("Issues with Parsing URL Parameter's - " + err);
    return "0"
  }
}
// takes a UNIX integer date, and produces a prettier human string
function dateOf(date) {
  const milliseconds = date * 1000 // 1575909015000
  const dateObject = new Date(milliseconds)
  const humanDateFormat = dateObject.toLocaleString() //2019-12-9 10:30:15
  return humanDateFormat
}

function showPaintList(data) {
  // the data parameter will be a JS array of JS objects
  // this uses a combination of "HTML building" DOM methods (the document createElements) and
  // simple string interpolation (see the 'a' tag on title)
  // both are valid ways of building the html.
  const ul = document.getElementById('posts');
  const list = document.createDocumentFragment();

  data.map(function(post) {
    console.log("Paint:", post);
    let li = document.createElement('li');
    let title = document.createElement('h3');
    let body = document.createElement('p');
    // let by = document.createElement('p');
    title.innerHTML = `<a href="/paintdetails.html?paintid=${post.id}">${post.brand}</a>`;
    body.innerHTML = `${post.paintName}`;
    //let postedTime = dateOf(post.time)
    // by.innerHTML = `${post.date} - ${post.reportedBy}`;

    li.appendChild(title);
    li.appendChild(body);
    // li.appendChild(by);
    list.appendChild(li);
  });

  ul.appendChild(list);
}

function showPaintDetail(post) {
  // the data parameter will be a JS array of JS objects
  // this uses a combination of "HTML building" DOM methods (the document createElements) and
  // simple string interpolation (see the 'a' tag on title)
  // both are valid ways of building the html.
  const ul = document.getElementById('post');
  const detail = document.createDocumentFragment();

  console.log("Paint:", post);
  let li = document.createElement('div');
  let title = document.createElement('h2');
  let body = document.createElement('p');
  // let by = document.createElement('p');
  title.innerHTML = `${post.brand}`;
  body.innerHTML = `${post.paintName}`;
  //let postedTime = dateOf(post.time)
  // by.innerHTML = `${post.date} - ${post.reportedBy}`;

  li.appendChild(title);
  li.appendChild(body);
  // li.appendChild(by);
  detail.appendChild(li);

  ul.appendChild(detail);
}

function handlePages() {
  let paintid = parsePaintId()
  console.log("PaintId: ",paintid)

  if (paintid != null) {
    console.log("found a paintId")
    fetchPaint(paintid)
  } else {
    console.log("load all paints")
    fetchInventoryData()
  }
}

handlePages()
