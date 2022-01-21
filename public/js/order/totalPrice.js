function calculator(){
    let arrPrice =document.getElementsByClassName('priceUnit');
    let arrQuantity = document.getElementsByClassName('quantity');
    let total=0;
    for (let i=0; i<arrPrice.length; i++){
        total = total + (parseInt(arrPrice[i].innerHTML.substring(0,arrPrice[i].innerHTML.length - 3)) * parseInt(arrQuantity[i].value)); 
    }
    $('#totalPrice').val(total);
}