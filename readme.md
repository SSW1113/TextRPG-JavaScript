Rougelike 형식의 TextRPG입니다.

선택지를 통해 전투를 진행하면서 탑의 층을 올라가세요.
전투에서 승리하면 체력을 회복하고, 랜덤으로 보상을 얻습니다.
층을 올라가면 올라갈수록 몬스터들은 강해지고, 10층까지 돌파하면 클리어입니다.

Hp: 체력입니다. 0이 되면 사망합니다.
Atk: 공격력입니다. 공격했을때 이만큼의 데미지가 들어갑니다.
Crit: 치명타 확률입니다. 공격했을 때 치명타가 터질 확률입니다.
CritDmg: 치명타 데미지입니다. 치명타가 터졌을 때, 이것에 기반하여 데미지가 결정됩니다.

1. 공격한다 - 몬스터에게 Atk만큼의 데미지를 줍니다. 치명타가 터질 확률이 있습니다.
2. 치명타를 노린다 - 치명타가 터질 확률이 crit의 두배가 되지만, 실패하면 공격이 빗나갑니다.
3. 도망친다 - 25% 확률로 몬스터에게서 도망갈 수 있습니다. 대신 보상은 받지 못합니다.
0. 항복한다 - 몬스터에게 항복하고 게임오버됩니다.