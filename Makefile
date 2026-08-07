VERSION := $(shell jq -r .version package.json)
MAJOR := $(shell echo $(VERSION) | cut -d. -f1)
VERSION_REGEX := $(shell echo $(VERSION) | sed 's/\./\\./g')

.PHONY: release release-prepare dist release-tag release-push release-gh update-major help

help:
	@echo "Release tooling for v$(VERSION) (read from package.json)"
	@echo ""
	@echo "  make release          Full release: bundle, commit, tag, push, GitHub release, update v$(MAJOR) tag"
	@echo "  make release-prepare  Bundle dist/ and commit release changes"
	@echo "  make dist             Rebuild dist/ via ncc"
	@echo "  make release-tag      Create annotated tag v$(VERSION)"
	@echo "  make release-push     Push main and tag v$(VERSION)"
	@echo "  make release-gh       Create GitHub release with CHANGELOG.md notes"
	@echo "  make update-major     Move floating tag v$(MAJOR) to v$(VERSION)"

release:
	@$(MAKE) release-prepare
	@$(MAKE) release-tag
	@$(MAKE) release-push
	@$(MAKE) release-gh
	@$(MAKE) update-major

dist:
	npm run bundle

release-prepare: dist
	@test -n "$$(sed -n '/^## v$(VERSION_REGEX)/p' CHANGELOG.md)" || (echo "error: no '## v$(VERSION)' section in CHANGELOG.md"; exit 1)
	git add package.json CHANGELOG.md dist/
	@git diff --cached --quiet && echo "nothing to commit" || git commit -m "release: v$(VERSION)"

release-tag:
	@command -v gh >/dev/null || (echo "error: gh CLI required"; exit 1)
	git tag -a v$(VERSION) -m "Release v$(VERSION)"

release-push:
	git push origin main
	git push origin v$(VERSION)

release-gh:
	@command -v gh >/dev/null || (echo "error: gh CLI required"; exit 1)
	@NOTES=$$(sed -n '/^## v$(VERSION_REGEX)/,/^## v/{/^## v/d;p}' CHANGELOG.md | sed '/./,$$!d'); \
	gh release create v$(VERSION) --title "v$(VERSION)" --notes "$$NOTES"

update-major:
	git tag -fa v$(MAJOR) -m "Update v$(MAJOR) tag to v$(VERSION)"
	git push origin v$(MAJOR) --force
