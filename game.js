import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';

function getRandomInt(min, max) { // 두 정수를 입력받아 그 사이의 랜덤 정수를 출력하는 함수
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function success(percent) { // 확률을 입력받아서 성공 실패 결정하는 함수
  let arr = [percent, 100 - percent];
  if (getRandomInt(0, 100) <= percent)
    return true;
  else
    return false;
};

class Player {
  constructor() {
    this.hp = 100;
    this.atk = 10;
    this.crit = 20;
    this.critdmg = 1.5;
    this.canRun = 25;
  }

  attack(target) {
    // 플레이어의 공격
    target.hp -= this.atk;
  }

  critatk(target) {
    const lastdmg = Math.floor(this.atk * this.critdmg);
    target.hp -= lastdmg;
  }
}

class Monster {
  constructor(name) {
    this.name = name;
    this.hp = 25;
    this.atk = 7;
  }

  attack(target) {
    // 몬스터의 공격
    target.hp -= this.atk;
  }
}

function displayStatus(floor, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Floor: ${floor}|`) +
    chalk.blueBright(
      `\n| 플레이어 정보 | `,
      `Hp: ${player.hp} | `,
      `Atk: ${player.atk} | `,
      `Crit: ${player.crit}% | `,
      `CritDmg: x${player.critdmg} | `
    ) +
    chalk.redBright(
      `\n| 몬스터 정보 |`,
      `Name: ${monster.name} | `,
      `HP: ${monster.hp} | `,
      `Atk: ${monster.atk} | `
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];
  let run;

  while (player.hp > 0 && monster.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => process.stdout.write(log));

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 치명타를 노린다 3. 도망친다(${player.canRun}%) 0. 항복한다 `,
      ),
    );
    const choice = readlineSync.question('선택: ');
    // 플레이어의 선택에 따라 다음 행동 처리
    // logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
    switch (choice) {
      case '1':
        logs.push(chalk.green(`몬스터를 공격! `));
        if (success(player.crit)) { // 치명타 발생
          logs.push(chalk.redBright(`치명타!! ${Math.floor(player.atk * player.critdmg)}의 데미지!!!\n`));
          player.critatk(monster);
        } else {
          logs.push(chalk.yellow(`${player.atk}의 데미지!\n`));
          player.attack(monster);
        }
        break;
      case '2':
        logs.push(chalk.green(`치명타를 노린 공격! `));
        if (success(player.crit * 2)) { // 치명타 발생
          logs.push(chalk.redBright(`치명타!! ${Math.floor(player.atk * player.critdmg)}의 데미지!!!\n`));
          player.critatk(monster);
        } else {
          logs.push(chalk.gray(`무리하게 공격하는 바람에 공격이 빗나가 버렸다..\n`));
        }
        break;
      case '3':
        if (success(player.canRun)){
          console.log(chalk.blueBright(`성공적으로 도망쳤습니다.\n`));
          run = true;
        }
        else
          logs.push(chalk.cyan(`도망에 실패했습니다..\n`));
        break;
      case '0':
        console.log(chalk.red(`몬스터에게 항복했습니다...`));
        player.hp = 0;
        break;
      default:
        await battle(stage, player, monster);
        break;
    }

    if(player.hp <= 0 || monster.hp <= 0 || run)
      break;

    // 몬스터의 행동
    monster.attack(player);
    logs.push(chalk.green(`몬스터가 공격해왔다! `), chalk.red(`${monster.atk}만큼의 데미지를 입었다..\n`));
  }

  if (player.hp <= 0) {
    console.clear();
    displayStatus(stage, player, monster);
    logs.forEach((log) => process.stdout.write(log));
    console.log(chalk.red('플레이어 사망'));
    process.exit(0);
  } else if (monster.hp <= 0) {
    console.clear();
    displayStatus(stage, player, monster);
    logs.forEach((log) => process.stdout.write(log));
    console.log(chalk.green(`${monster.name}을 해치웠다!`));
    console.log(chalk.magenta('체력이 50 회복되었다.'));
    player.hp += 50;
    const reward = getRandomInt(0,2);
    let amount;
    if(reward === 0){
      amount = getRandomInt(1,3);
      player.atk += amount;
      console.log(chalk.magenta(`보상: 공격력 ${amount} 증가 => Atk: ${player.atk}(+${amount})`));
    } else if (reward === 1){
      amount = getRandomInt(5, 10);
      player.crit += amount;
      console.log(chalk.magenta(`보상: 치명타 확률 ${amount} 증가 => Crit: ${player.crit}%(+${amount})`));
    } else if (reward === 2){
      amount = getRandomInt(2,5);
      player.critdmg += (amount/10);
      console.log(chalk.magenta(`보상: 치명타 데미지 ${amount/10} 증가 => CritDmg: x${player.critdmg}(+${amount/10})`));
    }
  }

  readlineSync.question(chalk.gray('아무 키나 입력해서 다음 전투로 넘어가세요\n'));
};

export async function startGame() {
  console.clear();
  const player = new Player();
  player.hp = 100;
  let stage = 1;

  while (stage <= 10) {
    let mult = 1 + ((stage - 1) * 0.2);
    const monster = new Monster('Monster');
    monster.hp = Math.floor(monster.hp*mult);
    monster.atk = Math.floor(monster.atk*mult);
    await battle(stage, player, monster);

    if (player.hp <= 0) {
      console.log('플레이어 사망');
      process.exit(0);
    }
    // 스테이지 클리어 및 게임 종료 조건

    stage++;
  }
  console.clear()
  console.log(
    chalk.yellow(
        figlet.textSync('GAEM CLEAR', {
            font: 'Standard',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        })
    )
);
}