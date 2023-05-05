const it = require('jest');

it ('Создаёт приветствие', () => {
    expect(sayHello("Стас", "Басов")).toBe("Здравствуйте, Стас Басов!");
});

module.exports = it;
