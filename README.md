# Quarkus API example
[![Contribute](https://www.eclipse.org/che/contribute.svg)](https://workspaces.openshift.com/f?url=https://github.com/che-incubator/quarkus-api-example/tree/devfilev1&override.attributes.persistVolumes=false)
[![Contribute (nightly)](https://img.shields.io/static/v1?label=nightly%20Che&message=for%20maintainers&logo=eclipseche&color=FDB940&labelColor=525C86)](https://che-dogfooding.apps.che-dev.x6e0.p1.openshiftapps.com#https://github.com/che-incubator/quarkus-api-example)

Quarkus REST API with Hibernate ORM, Panache, RESTEasy, and PostgreSQL. Requires JDK 11.

NOTE: Perfoming a native Quarkus build with the `packagenative` command fails on [Eclipse Che Hosted by Red Hat](https://www.eclipse.org/che/docs/che-7/hosted-che/hosted-che) due to the 7GB usage limit.

## Endpoints
| Method | Endpoint                            | Description                                                |
|--------|-------------------------------------|------------------------------------------------------------|
| `GET`  | `/food`                             | Lists all Food resources                                   |
| `GET`  | `/food/{id}`                        | Retrieves the Food resource with the specified ID          |
| `GET`  | `/food/search/{name}`               | Retrieves a Food resource with the specified name          |
| `GET`  | `/food/restaurant/{restaurantName}` | Lists all Food resources with the specified restaurantName |
| `POST` | `/food`                             | Creates a Food resource                                    |

## Local development
### Create PostgresSQL container
```
docker run -it --rm=true --name food_db -e POSTGRESQL_USER=user -e POSTGRESQL_PASSWORD=password -e POSTGRESQL_DATABASE=food_db -p 5432:5432 quay.io/centos7/postgresql-13-centos7@sha256:994f5c622e2913bda1c4a7fa3b0c7e7f75e7caa3ac66ff1ed70ccfe65c40dd75
```

### Run in development mode
```
./mvnw compile quarkus:dev
```
Navigate to `localhost:8080/food` to view the [pre-imported](https://github.com/che-incubator/quarkus-api-example/blob/main/src/main/resources/import.sql) `Food` resources.

### Packaging the application
```
./mvnw clean package
```

### Run tests only
```
./mvnw test
```

## Resources
* https://quarkus.io/guides/maven-tooling
* https://quarkus.io/guides/hibernate-orm-panache
* https://quarkus.io/guides/building-native-image
