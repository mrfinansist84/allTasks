export default class Model {
    constructor(control) {
        this.control = control;
        this.dataBase = [];
        this.filteredBase = [];
        this.subFilteredBase = [];
        this.filterParams = [];
        this.dictionary = {};
        this.count = 0;
        this.cartOrderAmount = (JSON.parse(localStorage.getItem("cartOrderAmount"))) ?
        JSON.parse(localStorage.getItem("cartOrderAmount")) : [];
    }
    getFromLocalStorage(key) {
        JSON.parse(localStorage.getItem(key));
    }
    setToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    getDataBaseWithoutFilters() {
        this.filteredBase = this.dataBase;
    }
    changeDataBaseForLeafSliderNext() {
        this.filteredBase = this.filteredBase[0].id === 1 ?
            this.filteredBase :
            this.filteredBase.reverse();
    }
    changeDataBaseForLeafSliderPrev() {
        this.filteredBase = this.filteredBase[0].id === 1 ?
            this.filteredBase.reverse() :
            this.filteredBase;
    }
    delUnitFromCart(e) {
        this.cartOrderAmount.forEach((el, i) => {
            if (el.id == e.target.dataset.id) {
                el.orderAmount--;
                this.dataBase[el.id - 1].orderAmount = el.orderAmount;
                el.orderAmount === 0 ? this.cartOrderAmount.splice(i, 1) : 0;
                this.control.updateOrderAmount(e, el);
            }
        })
    }
    updateUnitInCart(e) {
        this.cartOrderAmount.forEach((el) => {
            if (el.id == e.target.dataset.id) {
                if (el.orderAmount == el.quantity) {
                    this.control.addPopUpEmotyStop(e.target);
                } else if (el.quantity <= 0) {
                    this.control.addPopUpEmotyStop(e.target);
                } else {
                    el.orderAmount++;
                }
                this.dataBase.find((el) => el.id == e.target.dataset.id)
                .orderAmount = el.orderAmount;
            }
            this.control.updateOrderAmount(e, el);
        })
    }
    addUnitInCart(e) {
        this.dataBase.forEach((el) => {
            if (el.id == e.target.dataset.id) {
                if (el.orderAmount == el.quantity) {
                    this.control.addPopUpEmotyStop(e.target);
                } else if (this.dataBase.quantity === 0) {
                    this.control.addPopUpEmotyStop(e.target);
                } else {
                    el.orderAmount++;
                    this.cartOrderAmount.push(el);
                }
                this.control.updateOrderAmount(e, el);
            }
        })
    }
    getDataFromServer() {
        if (JSON.parse(localStorage.getItem("dataBase"))) {
            this.dataBase = JSON.parse(localStorage.getItem("dataBase"))
            this.control.controllermakeStartPage();
        } else {
            fetch('./js/dataBase.json')
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    this.makeDataBase(data);
                    this.control.controllermakeStartPage();
                });
        }
    }
    getDictionaryFromServer(lang = "En") {
        fetch(`./js/dictionary${lang}.json`)
            .then(response => {
                return response.json()
            })
            .then(dictionary => {
                this.dictionary = dictionary;
                this.control.controllerMakeSliderPage(this.dictionary);
            })
    }

    makeDataBase(dataBase) {
        const res = [];
        dataBase.forEach(element => {
            switch (element.type) {
                case 'cat':
                    res.push(new Cat(element));
                    break;
                case 'dog':
                    res.push(new Dog(element));
                    break;
                case 'fish':
                    res.push(new Fish(element));
                    break;
                case 'bird':
                    res.push(new Bird(element));
                    break;
            }
        });
        this.dataBase = res;
        localStorage.setItem("dataBase", JSON.stringify(this.dataBase));
    }
}

class Animal {
    constructor(dataBase) {
        this.id = dataBase.id;
        this.type = dataBase.type;
        this.name = dataBase.name;
        this.price = dataBase.price;
        this.orderAmount = 0;
        this.url = dataBase.url;
        this.quantity = dataBase.quantity;
        this.ageMonth = dataBase.ageMonth;
        this.weightKg = dataBase.weightKg;
        this.color = dataBase.color;
        this.gender = dataBase.gender;
        this.lifetimeYears = dataBase.lifetimeYears;
        this.rapacity = dataBase.rapacity
    }
}

class CatDog extends Animal {
    constructor(dataBase) {
        super(dataBase);
        this.fur = dataBase.fur;
        this.shortLegged = dataBase.shortLegged;
        this.pedigree = dataBase.pedigree;
        this.trimming = dataBase.trimming;
    }
}

class Cat extends CatDog {
    constructor(dataBase) {
        super(dataBase);
        this.lopiness = dataBase.lopiness;
    }
}

class Dog extends CatDog {
    constructor(dataBase) {
        super(dataBase);
        this.specialization = dataBase.specialization;
    }
}

class Fish extends Animal {
    constructor(dataBase) {
        super(dataBase);
        this.freshwater = dataBase.zonality;
        this.zonality = dataBase.zonality;
    }
}

class Bird extends Animal {
    constructor(dataBase) {
        super(dataBase);
        this.flying = dataBase.flying;
        this.talking = dataBase.talking;
        this.singing = dataBase.singing;
    }
}