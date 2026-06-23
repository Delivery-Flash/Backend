import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hash = async (pw: string) => bcrypt.hash(pw, 10)

  // ============================================================
  // 1. USUARIOS
  // ============================================================
  await prisma.user.createMany({
    data: [
      { first_name: 'Admin',   last_name: 'Flash',    email: 'admin@flashdelivery.com', password: await hash('password'), role: 'ADMIN'  },
      { first_name: 'Carlos',  last_name: 'Lopez',    email: 'carlosCliente@mail.com',  password: await hash('password'), role: 'CLIENT' },
      { first_name: 'Maria',   last_name: 'Gomez',    email: 'mariaCliente@mail.com',   password: await hash('password'), role: 'CLIENT' },
      { first_name: 'Pedro',   last_name: 'Ramirez',  email: 'pedroCliente@mail.com',   password: await hash('password'), role: 'CLIENT' },
      { first_name: 'Sofia',   last_name: 'Herrera',  email: 'sofiaCliente@mail.com',   password: await hash('password'), role: 'CLIENT' },
      { first_name: 'Diego',   last_name: 'Castro',   email: 'diegoCliente@mail.com',   password: await hash('password'), role: 'CLIENT' },
      { first_name: 'Juan',    last_name: 'Rider',    email: 'juanRider@mail.com',      password: await hash('password'), role: 'RIDER'  },
      { first_name: 'Luis',    last_name: 'Moto',     email: 'luisRider@mail.com',      password: await hash('password'), role: 'RIDER'  },
      { first_name: 'Ana',     last_name: 'Bici',     email: 'anaRider@mail.com',       password: await hash('password'), role: 'RIDER'  },
      { first_name: 'Roberto', last_name: 'Carro',    email: 'robertoRider@mail.com',   password: await hash('password'), role: 'RIDER'  },
    ],
    skipDuplicates: true,
  })

  // ============================================================
  // 2. BUSCAR USUARIOS
  // ============================================================
  const carlos  = await prisma.user.findUnique({ where: { email: 'carlosCliente@mail.com'  } })
  const maria   = await prisma.user.findUnique({ where: { email: 'mariaCliente@mail.com'   } })
  const pedro   = await prisma.user.findUnique({ where: { email: 'pedroCliente@mail.com'   } })
  const sofia   = await prisma.user.findUnique({ where: { email: 'sofiaCliente@mail.com'   } })
  const diego   = await prisma.user.findUnique({ where: { email: 'diegoCliente@mail.com'   } })
  const juan    = await prisma.user.findUnique({ where: { email: 'juanRider@mail.com'      } })
  const luis    = await prisma.user.findUnique({ where: { email: 'luisRider@mail.com'      } })
  const ana     = await prisma.user.findUnique({ where: { email: 'anaRider@mail.com'       } })
  const roberto = await prisma.user.findUnique({ where: { email: 'robertoRider@mail.com'   } })

  // ============================================================
  // 3. PERFILES DE RIDERS
  // ============================================================
  await prisma.riderProfile.createMany({
    data: [
      { user_id: juan!.id,    license_plate: 'P-001XYZ', vehicle_type: 'MOTO',      vehicle_model: 'Honda CB150',  zone: 'ZONA_1', is_verified: true  },
      { user_id: luis!.id,    license_plate: 'P-002ABC', vehicle_type: 'MOTO',      vehicle_model: 'Yamaha FZ',    zone: 'ZONA_2', is_verified: true  },
      { user_id: ana!.id,     license_plate: 'N/A',      vehicle_type: 'BICICLETA', vehicle_model: 'Trek FX3',     zone: 'ZONA_1', is_verified: false },
      { user_id: roberto!.id, license_plate: 'P-999ZZZ', vehicle_type: 'CARRO',     vehicle_model: 'Toyota Yaris', zone: 'ZONA_3', is_verified: true  },
    ],
    skipDuplicates: true,
  })

  // ============================================================
  // 4. PEDIDOS
  // ============================================================
  await prisma.order.createMany({
    data: [
      { client_id: carlos!.id,  rider_id: juan!.id,    origin: 'Zona 10, Ciudad de Guatemala', destination: 'Zona 1, Ciudad de Guatemala',  description: 'Caja pequeña con documentos', distance_km: 5.2,  base_fare: 26.00, final_price: 26.00, zone: 'ZONA_1', status: 'DELIVERED' },
      { client_id: maria!.id,   rider_id: luis!.id,    origin: 'Zona 4, Ciudad de Guatemala',  destination: 'Zona 14, Ciudad de Guatemala', description: 'Zapatos en bolsa',             distance_km: 3.8,  base_fare: 19.00, final_price: 19.00, zone: 'ZONA_2', status: 'DELIVERED' },
      { client_id: pedro!.id,   rider_id: roberto!.id, origin: 'Zona 9, Ciudad de Guatemala',  destination: 'Zona 11, Ciudad de Guatemala', description: 'Laptop en mochila',             distance_km: 6.5,  base_fare: 32.50, final_price: 32.50, zone: 'ZONA_3', status: 'DELIVERED' },
      { client_id: sofia!.id,   rider_id: juan!.id,    origin: 'Zona 7, Ciudad de Guatemala',  destination: 'Zona 3, Ciudad de Guatemala',  description: 'Ropa en bolsa',                distance_km: 4.1,  base_fare: 20.50, final_price: 20.50, zone: 'ZONA_1', status: 'ACCEPTED'  },
      { client_id: diego!.id,   rider_id: luis!.id,    origin: 'Zona 6, Ciudad de Guatemala',  destination: 'Zona 12, Ciudad de Guatemala', description: 'Medicamentos urgentes',         distance_km: 8.3,  base_fare: 41.50, final_price: 41.50, zone: 'ZONA_2', status: 'ACCEPTED'  },
      { client_id: carlos!.id,                         origin: 'Zona 13, Ciudad de Guatemala', destination: 'Zona 5, Ciudad de Guatemala',  description: 'Sobre con llaves',              distance_km: 7.1,  base_fare: 35.50,                       zone: 'ZONA_1', status: 'AVAILABLE' },
      { client_id: maria!.id,                          origin: 'Zona 2, Ciudad de Guatemala',  destination: 'Zona 8, Ciudad de Guatemala',  description: 'Flores en caja',                distance_km: 9.0,  base_fare: 45.00,                       zone: 'ZONA_2', status: 'AVAILABLE' },
      { client_id: pedro!.id,                          origin: 'Zona 15, Ciudad de Guatemala', destination: 'Zona 6, Ciudad de Guatemala',  description: 'Paquete sin descripción',       distance_km: 10.2, base_fare: 51.00,                       zone: 'ZONA_3', status: 'AVAILABLE' },
    ],
    skipDuplicates: true,
  })

  // ============================================================
  // 5. CALIFICACIONES
  // ============================================================
  const orden_carlos = await prisma.order.findFirst({ where: { client_id: carlos!.id,  status: 'DELIVERED' } })
  const orden_maria  = await prisma.order.findFirst({ where: { client_id: maria!.id,   status: 'DELIVERED' } })
  const orden_pedro  = await prisma.order.findFirst({ where: { client_id: pedro!.id,   status: 'DELIVERED' } })

  const ratings: Prisma.RatingCreateManyInput[] = []
  if (orden_carlos) ratings.push({ order_id: orden_carlos.id, client_id: carlos!.id, rider_id: juan!.id,    stars: 5, comment: 'Muy rápido y cuidadoso'           })
  if (orden_maria)  ratings.push({ order_id: orden_maria.id,  client_id: maria!.id,  rider_id: luis!.id,    stars: 4, comment: 'Llegó a tiempo, buen servicio'     })
  if (orden_pedro)  ratings.push({ order_id: orden_pedro.id,  client_id: pedro!.id,  rider_id: roberto!.id, stars: 3, comment: 'Tardó un poco más de lo esperado'  })

  if (ratings.length > 0) {
    await prisma.rating.createMany({ data: ratings, skipDuplicates: true })
  }

  // ============================================================
  // 6. GANANCIAS
  // ============================================================
  const earnings: Prisma.RiderEarningsCreateManyInput[] = []
  if (orden_carlos) earnings.push({ rider_id: juan!.id,    order_id: orden_carlos.id, gross_amount: 26.00, platform_fee: 3.90,  net_amount: 22.10  })
  if (orden_maria)  earnings.push({ rider_id: luis!.id,    order_id: orden_maria.id,  gross_amount: 19.00, platform_fee: 2.85,  net_amount: 16.15  })
  if (orden_pedro)  earnings.push({ rider_id: roberto!.id, order_id: orden_pedro.id,  gross_amount: 32.50, platform_fee: 4.875, net_amount: 27.625 })

  if (earnings.length > 0) {
    await prisma.riderEarnings.createMany({ data: earnings, skipDuplicates: true })
  }

  // ============================================================
  // 7. NOTIFICACIONES
  // ============================================================
  const orden_sofia = await prisma.order.findFirst({ where: { client_id: sofia!.id, status: 'ACCEPTED' } })
  const orden_diego = await prisma.order.findFirst({ where: { client_id: diego!.id, status: 'ACCEPTED' } })

  const notifs: Prisma.NotificationCreateManyInput[] = []

  if (orden_carlos) {
    notifs.push(
      { user_id: carlos!.id, order_id: orden_carlos.id, type: 'PEDIDO_CREADO',       title: 'Pedido creado',       body: 'Tu pedido fue registrado y está en espera de un rider.',      is_read: true  },
      { user_id: carlos!.id, order_id: orden_carlos.id, type: 'PEDIDO_ACEPTADO',     title: 'Pedido aceptado',     body: 'Juan ha aceptado tu pedido y va en camino a recogerlo.',      is_read: true  },
      { user_id: carlos!.id, order_id: orden_carlos.id, type: 'EN_CAMINO',           title: 'En camino',           body: 'Tu paquete fue recogido y está en camino al destino.',         is_read: true  },
      { user_id: carlos!.id, order_id: orden_carlos.id, type: 'ENTREGADO',           title: '¡Entregado!',         body: 'Tu paquete fue entregado. ¡Califica el servicio!',             is_read: true  },
      { user_id: juan!.id,   order_id: orden_carlos.id, type: 'ENTREGADO',           title: 'Entrega completada',  body: 'Has completado una entrega. Revisa tus ganancias.',            is_read: true  },
      { user_id: juan!.id,   order_id: orden_carlos.id, type: 'PAGO_PROCESADO',      title: 'Pago procesado',      body: 'Se han registrado Q22.10 en tus ganancias.',                   is_read: true  },
      { user_id: juan!.id,   order_id: orden_carlos.id, type: 'CALIFICACION_RECIBIDA', title: 'Nueva calificación', body: 'Carlos te dio 5 estrellas. ¡Excelente trabajo!',              is_read: false },
    )
  }

  if (orden_maria) {
    notifs.push(
      { user_id: maria!.id, order_id: orden_maria.id, type: 'PEDIDO_CREADO',   title: 'Pedido creado',   body: 'Tu pedido fue registrado y está en espera de un rider.', is_read: true  },
      { user_id: maria!.id, order_id: orden_maria.id, type: 'PEDIDO_ACEPTADO', title: 'Pedido aceptado', body: 'Luis ha aceptado tu pedido y va en camino a recogerlo.', is_read: true  },
      { user_id: maria!.id, order_id: orden_maria.id, type: 'ENTREGADO',       title: '¡Entregado!',     body: 'Tu paquete fue entregado exitosamente.',                 is_read: false },
      { user_id: luis!.id,  order_id: orden_maria.id, type: 'PAGO_PROCESADO',  title: 'Pago procesado',  body: 'Se han registrado Q16.15 en tus ganancias.',             is_read: false },
    )
  }

  if (orden_sofia) {
    notifs.push(
      { user_id: sofia!.id, order_id: orden_sofia.id, type: 'PEDIDO_CREADO',   title: 'Pedido creado',   body: 'Tu pedido fue registrado y está en espera de un rider.', is_read: true  },
      { user_id: sofia!.id, order_id: orden_sofia.id, type: 'PEDIDO_ACEPTADO', title: 'Pedido aceptado', body: 'Juan ha aceptado tu pedido.',                            is_read: true  },
      { user_id: sofia!.id, order_id: orden_sofia.id, type: 'EN_CAMINO',       title: 'En camino',       body: 'Tu paquete está en camino.',                             is_read: false },
    )
  }

  if (orden_diego) {
    notifs.push(
      { user_id: diego!.id, order_id: orden_diego.id, type: 'PEDIDO_CREADO',   title: 'Pedido creado',   body: 'Tu pedido fue registrado y está en espera de un rider.', is_read: true  },
      { user_id: diego!.id, order_id: orden_diego.id, type: 'PEDIDO_ACEPTADO', title: 'Pedido aceptado', body: 'Luis ha aceptado tu pedido y va en camino.',             is_read: false },
    )
  }

  if (notifs.length > 0) {
    await prisma.notification.createMany({ data: notifs, skipDuplicates: true })
  }

  console.log('Seed ejecutado correctamente')
  console.log(`   Usuarios:       10`)
  console.log(`   Rider profiles: 4`)
  console.log(`   Pedidos:        8`)
  console.log(`   Calificaciones: ${ratings.length}`)
  console.log(`   Ganancias:      ${earnings.length}`)
  console.log(`   Notificaciones: ${notifs.length}`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())