function enviar() {
  let tempo = document.getElementById('tempo');

  if (isNaN(tempo.value)) {
    alert('Informe apenas números em quantidade de horas!');
    tempo.focus();
    return false;
  }
  return true;
}

function excluir(id) {
  if (confirm(`Deseja realmente excluir o certificado?`)) {
    window.location.href = '/excluir?id=' + id;
  } else {
    window.location.href = '/';
  }
}
