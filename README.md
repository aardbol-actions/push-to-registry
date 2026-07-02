# push-to-registry

[![CI checks](https://github.com/aardbol-actions/push-to-registry/workflows/CI%20checks/badge.svg)](https://github.com/aardbol-actions/push-to-registry/actions?query=workflow%3A%22CI+checks%22)
[![Link checker](https://github.com/aardbol-actions/push-to-registry/workflows/Link%20checker/badge.svg)](https://github.com/aardbol-actions/push-to-registry/actions?query=workflow%3A%22Link+checker%22)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/aardbol-actions/push-to-registry/badge)](https://securityscorecards.dev/viewer/?uri=github.com/aardbol-actions/push-to-registry)
<br><br>
[![Push to GHCR](https://github.com/aardbol-actions/push-to-registry/actions/workflows/ghcr-push.yaml/badge.svg)](https://github.com/aardbol-actions/push-to-registry/actions/workflows/ghcr-push.yaml)
[![Login and Push](https://github.com/aardbol-actions/push-to-registry/workflows/Login%20and%20Push/badge.svg)](https://github.com/aardbol-actions/push-to-registry/actions?query=workflow%3A%22Login+and+Push%22)
[![Build and Push Manifest](https://github.com/aardbol-actions/push-to-registry/actions/workflows/push-manifest.yml/badge.svg)](https://github.com/aardbol-actions/push-to-registry/actions/workflows/push-manifest.yml)
[![Multiple container CLI build tests](https://github.com/aardbol-actions/push-to-registry/workflows/Multiple%20container%20CLI%20build%20tests/badge.svg)](https://github.com/aardbol-actions/push-to-registry/actions?query=workflow%3A%22Multiple+container+CLI+build+tests%22)
<br><br>
[![tag badge](https://img.shields.io/github/v/tag/aardbol-actions/push-to-registry)](https://github.com/aardbol-actions/push-to-registry/tags)
[![license badge](https://img.shields.io/github/license/aardbol-actions/push-to-registry](./LICENSE)
[![size badge](https://img.shields.io/github/size/aardbol-actions/push-to-registry/dist/index.js)](./dist)

Push-to-registry is a GitHub Action for pushing a container image or an [image manifest](https://github.com/containers/buildah/blob/main/docs/buildah-manifest.1.md) to an image registry, such as Dockerhub, the GitHub Container Registry, or an OpenShift integrated registry.

This action only runs on Linux, as it uses [podman](https://github.com/containers/Podman) to perform the push. [GitHub's Ubuntu action runners](https://github.com/actions/virtual-environments#available-environments) come with Podman preinstalled. If you are not using those runners, you must first [install Podman](https://podman.io/getting-started/installation).

You can log in to your container registry for the entire job using the [**podman-login**](https://github.com/redhat-actions/podman-login) action. Otherwise, use the `username` and `password` inputs to log in for this step.

## Action Inputs

Refer to the [`podman push`](http://docs.podman.io/en/latest/markdown/podman-manifest-push.1.html) documentation for more information.

| Input Name | Description | Default |
| ---------- | ----------- | ------- |
| image	| Name of the image or manifest you want to push. Eg. `username/imagename` or `imagename`. Refer to [Image and Tag Inputs](https://github.com/aardbol-actions/push-to-registry#image-tag-inputs). | **Required** - unless all tags include registry and image name
| tags | The tag or tags of the image or manifest to push. For multiple tags, separate by whitespace. Refer to [Image and Tag Inputs](https://github.com/aardbol-actions/push-to-registry#image-tag-inputs). | `latest`
| registry | Hostname and optional namespace to push the image to. Eg. `ghcr.io/username` or `ghcr.io/username/namespace`. Refer to [Image and Tag Inputs](https://github.com/aardbol-actions/push-to-registry#image-tag-inputs). | **Required** - unless all tags include registry and image name
| username | Username with which to authenticate to the registry. Required unless already logged in to the registry. | None
| password | Password, encrypted password, or access token to use to log in to the registry. Required unless already logged in to the registry. | None
| tls-verify | Verify TLS certificates when contacting the registry. Set to `false` to skip certificate verification. | `true`
| digestfile | After copying the image, write the digest of the resulting image to the file. The contents of this file are the digest output. | Auto-generated from image and tag
| extra-args | Extra args to be passed to podman push. Separate arguments by newline. Do not use quotes. | None

<a id="image-tag-inputs"></a>

### Image, Tag and Registry Inputs
The **push-to-registry** `image` and `tag` input work very similarly to [**buildah-build**](https://github.com/aardbol-actions/buildah-build#image-tag-inputs).

However, when using **push-to-registry** when the `tags` input are not fully qualified, the `registry` input must also be set.

So, for **push-to-registry** the options are as follows:

**Option 1**: Provide `registry`, `image`, and `tags` inputs. The image(s) will be pushed to `${registry}/${image}:${tag}`.

For example:
```yaml
registry: ghcr.io/my-namespace
image: my-image
tags: v1 v1.0.0
```
will push the image tags: `ghcr.io/my-namespace/my-image:v1` and `ghcr.io/my-namespace/my-image:v1.0.0`.

**Option 2**: Provide only the `tags` input, including the fully qualified image name in each tag. In this case, the `registry` and `image` inputs are ignored.

For example:
```yaml
# 'registry' and 'image' inputs are not set
tags: ghcr.io/my-namespace/my-image:v1 ghcr.io/my-namespace/my-image:v1.0.0
```
will push the image tags: `ghcr.io/my-namespace/my-image:v1` and `ghcr.io/my-namespace/my-image:v1.0.0`.

If the `tags` input does not have image names in the `${registry}/${name}:${tag}` form, then the `registry` and `image` inputs must be set.

## Action Outputs

`digest`: The pushed image digest, as written to the `digestfile`.<br>
For example:
```
sha256:66ce924069ec4181725d15aa27f34afbaf082f434f448dc07a42daa3305cdab3
```

For multiple tags, the digest is the same.

`registry-paths`: A JSON array of registry paths to which the tag(s) were pushed.<br>

For example:

```
[ "ghcr.io/username/spring-image:v1", "ghcr.io/username/spring-image:latest" ]
```

`registry-path`: The first element of `registry-paths`, as a string.

## Pushing Manifest

If multiple tags are provided, either all tags must point to manifests, or none of them. i.e., you cannot push both manifests are regular images in one `push-to-registry` step.

Refer to [Manifest Build and Push example](./.github/workflows/push-manifest.yml) for a sophisticated example of building and pushing a manifest.

## Examples

The example below shows how the `push-to-registry` action can be used to push an image created by the [**buildah-build**](https://github.com/aardbol-actions/buildah-build) action.

```yaml
name: Build and Push Image
on: [ push ]

jobs:
  build:
    name: Build and push image
    runs-on: ubuntu-24.04

    steps:
    - uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0

    - name: Build Image
      id: build-image
      uses: aardbol-actions/buildah-build@efe897b4cfe775f3e057a442c3d9fbd9db18a669 # v3.0.2
      with:
        image: my-app
        tags: latest ${{ github.sha }}
        containerfiles: |
          ./Containerfile

    # Podman Login action (https://github.com/redhat-actions/podman-login) can also be used to log in,
    # in which case 'username' and 'password' can be omitted.
    - name: Push To GHCR
      id: push-to-ghcr
      uses: aardbol-actions/push-to-registry@v3
      with:
        image: ${{ steps.build-image.outputs.image }}
        tags: ${{ steps.build-image.outputs.tags }}
        registry: ghcr.io/${{ github.repository_owner }}
        username: ${{ github.actor }}
        password: ${{ github.token }}

    - name: Print image url
      run: echo "Image pushed to ${{ steps.push-to-ghcr.outputs.registry-paths }}"
```
<!-- markdown-link-check-disable-next-line -->
Refer to [GHCR push example](./.github/workflows/ghcr-push.yaml) for complete example of push to [GitHub Container Registry (GHCR)](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

## Note about images built with Docker

This action uses `Podman` to push, but can also push images built with `Docker`. However, Docker and Podman store their images in different locations, and Podman can only push images in its own storage.

If the image to push is present in the Docker image storage but not in the Podman image storage, it will be pulled into Podman's storage.

If the image to push is present in both the Docker and Podman image storage, the action will push the image which was more recently built, and log a warning.

If the action pulled an image from the Docker image storage into the Podman storage, it will be cleaned up from the Podman storage before the action exits.

## Note about GitHub runners and Podman
We recommend using `ubuntu-24.04` since it has a newer version of Podman.
