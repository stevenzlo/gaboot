function run(deck, firebase) {
    const db = firebase.firestore();
    const tableContent = document.querySelector('#scoreboard__table__content');
    const joinedGame = sessionStorage.getItem('joinedGame');
    db
        .collection('hosted-quiz')
        .doc(joinedGame)
        .collection('user')
        .onSnapshot(snapshots => {
            let userData = [];
            snapshots.forEach(snapshot => {
                const user = snapshot.data();
                const answers = user.answers;
                let points = 0;
                answers.forEach(answer => {
                    if (answer.result) points++;
                });
                userData.push({
                    name: user.name,
                    points: points
                });
            });
            userData.sort((a, b) => (a.points > b.points) ? -1 : ((b.points > a.points) ? 1 : 0));
            tableContent.innerHTML = userData.map((data, index) => {
                return `
                    <tr class="mdc-data-table__row">
                        <th class="mdc-data-table__cell mdc-data-table__cell--numeric" scope="row">${index + 1}</th>
                        <td class="mdc-data-table__cell">${data.name}</td>
                        <td class="mdc-data-table__cell mdc-data-table__cell--numeric">${data.points}</td>
                    </tr>
                `
            }).join('\n');
        },  error => {
            console.error(error);
        });
}

module.exports = {
    run: run
};