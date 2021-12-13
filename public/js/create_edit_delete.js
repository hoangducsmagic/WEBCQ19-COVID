let arrDelete = document.querySelectorAll("table tr > td > .get-id-delete");
let arrEdit = document.querySelectorAll("table tr > td > .get-id-edit");
let Form = document.forms['delete-product-form'];
let btnYES = document.getElementById('delete-products-comfirm');

let idSlug;



for (let i = 0; i < arrDelete.length; i++) {
    arrDelete[i].addEventListener('click', () => {
        idSlug = arrDelete[i].getAttribute('data-id');
        Form.innerHTML = '';
        btnYES.addEventListener('click', () => {
            Form.action = '/products/' + idSlug + '?_method=PATCH';
            Form.submit();
        });
    });
    arrEdit[i].addEventListener('click', () => {
        idSlug = arrDelete[i].getAttribute('data-id');

        let getID = document.getElementsByClassName(idSlug)[0].querySelectorAll('td');

        console.log(getID);

        let name = document.createElement("input");
        name.name = 'name';
        name.value = getID[1].innerHTML;
        let image = document.createElement("input");
        image.name = 'image';
        image.value = getID[2].querySelector('img').getAttribute('src');
        let price = document.createElement("input");
        price.name = 'price';
        price.value = getID[3].innerHTML;
        let quantitativeUnit = document.createElement("input");
        quantitativeUnit.name = 'quantitative unit';
        quantitativeUnit.value = getID[4].innerHTML;

        Form.appendChild(name);
        Form.appendChild(image);
        Form.appendChild(price);
        Form.appendChild(quantitativeUnit);

        console.log(document.querySelector('#dialog-modal > div').appendChild(Form));
           
        btnYES.addEventListener('click', () => {
            Form.action = '/products/' + idSlug + '?_method=PUT';
            Form.submit();
        });
    });
}


