create table usuarios (
  id serial primary key not null,
  nome varchar(100),
  email varchar(100) unique,
  senha varchar(100)
  );
  
create table categorias (
    id serial primary key not null,
    descricao varchar(255)
  );
  
create table transacoes (
  id serial primary key not null,
  descricao varchar(255),
  valor numeric(10, 2),
  data date,
  categoria_id int,
  usuario_id int,
  tipo varchar(100)
  );
  
alter table transacoes
add constraint fk_categoria foreign key (categoria_id) references categorias (id),
add constraint fk_usuario foreign key (usuario_id) references usuarios (id);

insert into categorias (descricao)
values 
	('Alimentação'),
    ('Assinaturas e Serviços'),
    ('Casa'),
    ('Mercado'),
    ('Cuidados Pessoais'),
    ('Educação'),
    ('Família'),
    ('Lazer'),
    ('Pets'),
    ('Presentes'),
    ('Roupas'),
    ('Saúde'),
    ('Transporte'),
    ('Salário'),
    ('Vendas'),
    ('Outras receitas'),
    ('Outras despesas');